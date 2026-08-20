/**
 * Express routes for the AI Sales Agent chat widget.
 *
 * tRPC's batched HTTP link buffers whole responses, so token-by-token streaming
 * gets its own plain Express endpoint using Server-Sent Events. Lead reads and
 * writes stay in tRPC (see the `aiAgent` router in `server/routers.ts`).
 *
 * POST /api/ai-agent/chat   -> SSE stream of assistant tokens
 * GET  /api/ai-agent/health -> configuration probe
 */

import type { Express, Request, Response } from "express";
import {
  CONVERSATION_CONTEXT_LIMIT,
  GREETING_MESSAGE,
  MAX_MESSAGE_LENGTH,
  buildSystemPrompt,
  ensureLead,
  extractContactFallback,
  extractLeadData,
  getLeadBySessionId,
  isAgentConfigured,
  limitContext,
  saveConversationTurn,
  streamChatCompletion,
  type ChatMessage,
} from "./aiSalesAgent";
import { sdk } from "./_core/sdk";

/** Simple in-memory rate limit: max requests per IP per rolling window. */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitBuckets = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitBuckets.get(key) ?? []).filter(
    ts => now - ts < RATE_LIMIT_WINDOW_MS
  );

  timestamps.push(now);
  rateLimitBuckets.set(key, timestamps);

  // Opportunistic cleanup so the map can't grow forever.
  if (rateLimitBuckets.size > 5000) {
    rateLimitBuckets.forEach((bucketTimes: number[], bucketKey: string) => {
      if (bucketTimes.every((ts: number) => now - ts >= RATE_LIMIT_WINDOW_MS)) {
        rateLimitBuckets.delete(bucketKey);
      }
    });
  }

  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

const SESSION_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;

function parseMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;

  const messages: ChatMessage[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const { role, content } = item as Record<string, unknown>;

    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") return null;

    const trimmed = content.trim();
    if (!trimmed) continue;

    messages.push({ role, content: trimmed.slice(0, MAX_MESSAGE_LENGTH) });
  }

  return messages;
}

function sseWrite(res: Response, event: string, data: unknown): void {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

export function registerAiAgentRoutes(app: Express): void {
  app.get("/api/ai-agent/health", (_req: Request, res: Response) => {
    res.json({
      configured: isAgentConfigured(),
      greeting: GREETING_MESSAGE,
    });
  });

  app.post("/api/ai-agent/chat", async (req: Request, res: Response) => {
    const clientKey =
      (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ||
      req.ip ||
      "unknown";

    if (isRateLimited(clientKey)) {
      res.status(429).json({
        error:
          "You're sending messages a little too quickly. Give me a moment and try again.",
      });
      return;
    }

    const { sessionId, messages: rawMessages } = req.body ?? {};

    if (typeof sessionId !== "string" || !SESSION_ID_RE.test(sessionId)) {
      res.status(400).json({ error: "Invalid session id" });
      return;
    }

    const messages = parseMessages(rawMessages);
    if (!messages || messages.length === 0) {
      res.status(400).json({ error: "No messages provided" });
      return;
    }

    if (!isAgentConfigured()) {
      res.status(503).json({
        error: `Our design assistant is offline right now. Please call us at (434) 973-1691 or use the contact form and we'll get right back to you.`,
      });
      return;
    }

    // Signed-in visitors get their lead row linked to their account.
    let userId: number | null = null;
    try {
      const user = await sdk.authenticateRequest(req);
      userId = user?.id ?? null;
    } catch {
      userId = null;
    }

    // Create the lead row up front so even abandoned conversations are captured.
    const existingLead = await ensureLead(sessionId, userId);

    const contextMessages = limitContext(messages, CONVERSATION_CONTEXT_LIMIT);
    const promptMessages: ChatMessage[] = [
      { role: "system", content: buildSystemPrompt(existingLead) },
      ...contextMessages,
    ];

    // Open the SSE stream.
    res.status(200).set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.flushHeaders?.();

    const abortController = new AbortController();
    req.on("close", () => abortController.abort());

    let assistantMessage = "";

    try {
      assistantMessage = await streamChatCompletion(
        promptMessages,
        {
          onToken: token => {
            sseWrite(res, "token", { token });
          },
        },
        abortController.signal
      );
    } catch (error) {
      const aborted = abortController.signal.aborted;
      if (!aborted) {
        console.error(
          "[aiAgent] streaming failed:",
          error instanceof Error ? error.message : error
        );
        sseWrite(res, "error", {
          message:
            "Sorry, I lost my train of thought. Could you try that again? If it keeps happening, give us a call at (434) 973-1691.",
        });
      }
      res.end();
      return;
    }

    const fullTranscript: ChatMessage[] = [
      ...messages,
      { role: "assistant", content: assistantMessage },
    ];

    // Persist the transcript and run lead extraction. The visitor never waits on
    // this, but we do want the lead row saved before the request finishes.
    let leadResult: Awaited<ReturnType<typeof saveConversationTurn>>;
    try {
      let extracted = await extractLeadData(fullTranscript);
      if (!extracted) {
        extracted = extractContactFallback(fullTranscript);
      }

      leadResult = await saveConversationTurn({
        sessionId,
        userId,
        messages: fullTranscript,
        extracted,
      });
    } catch (error) {
      console.error("[aiAgent] lead persistence failed:", error);
    }

    sseWrite(res, "done", {
      message: assistantMessage,
      leadId: leadResult?.leadId ?? null,
      contactCaptured: leadResult?.contactCaptured ?? false,
    });

    res.end();
  });

  /**
   * Lightweight resume endpoint so a returning visitor can pick the
   * conversation back up in the same browser session.
   */
  app.get("/api/ai-agent/session/:sessionId", async (req, res) => {
    const { sessionId } = req.params;

    if (!SESSION_ID_RE.test(sessionId)) {
      res.status(400).json({ error: "Invalid session id" });
      return;
    }

    const lead = await getLeadBySessionId(sessionId);
    if (!lead) {
      res.json({ messages: [] });
      return;
    }

    let messages: ChatMessage[] = [];
    try {
      const parsed = JSON.parse(lead.conversationJson || "[]");
      if (Array.isArray(parsed)) messages = parsed;
    } catch {
      messages = [];
    }

    res.json({ messages });
  });
}
