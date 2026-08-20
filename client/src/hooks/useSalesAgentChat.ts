import { useCallback, useEffect, useRef, useState } from "react";

export type AgentMessage = {
  role: "user" | "assistant";
  content: string;
};

const SESSION_STORAGE_KEY = "critzers.designAssistant.sessionId";
const TRANSCRIPT_STORAGE_KEY = "critzers.designAssistant.transcript";

/** Server-side context window. Kept in sync with CONVERSATION_CONTEXT_LIMIT. */
const CONTEXT_LIMIT = 10;

export const GREETING_MESSAGE =
  "Hi! I'm the Critzer's design assistant. I can help you explore options, get a ballpark estimate, or book a consultation. What are you thinking about?";

export const SUGGESTED_PROMPTS = [
  "I'm planning a kitchen remodel",
  "How much does cabinet refacing cost?",
  "I need new cabinet hardware",
  "I'd like to book a showroom visit",
];

function createSessionId(): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID().replace(/-/g, "");
  }
  return `s${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function loadSessionId(): string {
  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored && /^[A-Za-z0-9_-]{8,64}$/.test(stored)) return stored;
  } catch {
    // localStorage can be unavailable in private modes; fall through.
  }

  const fresh = createSessionId();
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, fresh);
  } catch {
    // Non-fatal: the session just won't survive a reload.
  }
  return fresh;
}

function loadTranscript(): AgentMessage[] {
  try {
    const raw = window.sessionStorage.getItem(TRANSCRIPT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is AgentMessage =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    );
  } catch {
    return [];
  }
}

function persistTranscript(messages: AgentMessage[]): void {
  try {
    window.sessionStorage.setItem(
      TRANSCRIPT_STORAGE_KEY,
      JSON.stringify(messages.slice(-40))
    );
  } catch {
    // Non-fatal.
  }
}

export type UseSalesAgentChatResult = {
  messages: AgentMessage[];
  /** Tokens streaming in for the in-flight assistant reply. */
  streamingContent: string;
  isStreaming: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  resetConversation: () => void;
  stopStreaming: () => void;
  sessionId: string;
};

/**
 * Chat state machine for the AI sales agent widget.
 *
 * Talks to the SSE endpoint at /api/ai-agent/chat and exposes the assembled
 * transcript plus the partially streamed reply so the UI can render tokens as
 * they arrive.
 */
export function useSalesAgentChat(): UseSalesAgentChatResult {
  const [sessionId] = useState<string>(() =>
    typeof window === "undefined" ? "" : loadSessionId()
  );
  const [messages, setMessages] = useState<AgentMessage[]>(() =>
    typeof window === "undefined" ? [] : loadTranscript()
  );
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    persistTranscript(messages);
  }, [messages]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
    setStreamingContent(prev => {
      if (prev.trim()) {
        setMessages(current => [
          ...current,
          { role: "assistant", content: prev },
        ]);
      }
      return "";
    });
  }, []);

  const resetConversation = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setStreamingContent("");
    setIsStreaming(false);
    setError(null);
    try {
      window.sessionStorage.removeItem(TRANSCRIPT_STORAGE_KEY);
    } catch {
      // Non-fatal.
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) return;

      setError(null);

      const userMessage: AgentMessage = { role: "user", content: trimmed };
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setIsStreaming(true);
      setStreamingContent("");

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/ai-agent/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          signal: controller.signal,
          body: JSON.stringify({
            sessionId,
            messages: nextMessages.slice(-CONTEXT_LIMIT),
          }),
        });

        if (!response.ok || !response.body) {
          let message =
            "I'm having trouble connecting right now. Please try again, or call us at (434) 973-1691.";
          try {
            const payload = await response.json();
            if (payload?.error) message = payload.error;
          } catch {
            // Keep the default message.
          }
          setError(message);
          setIsStreaming(false);
          abortRef.current = null;
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assembled = "";
        let streamError: string | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";

          for (const frame of frames) {
            let eventName = "message";
            let dataLine = "";

            for (const rawLine of frame.split("\n")) {
              const line = rawLine.trimEnd();
              if (line.startsWith("event:")) {
                eventName = line.slice(6).trim();
              } else if (line.startsWith("data:")) {
                dataLine += line.slice(5).trim();
              }
            }

            if (!dataLine) continue;

            try {
              const payload = JSON.parse(dataLine);

              if (eventName === "token" && typeof payload.token === "string") {
                assembled += payload.token;
                setStreamingContent(assembled);
              } else if (eventName === "error") {
                streamError =
                  payload.message ||
                  "Something went wrong. Please try again in a moment.";
              } else if (eventName === "done") {
                if (typeof payload.message === "string" && payload.message) {
                  assembled = payload.message;
                }
              }
            } catch {
              // Ignore malformed frames.
            }
          }
        }

        if (assembled.trim()) {
          setMessages(current => [
            ...current,
            { role: "assistant", content: assembled },
          ]);
        }

        if (streamError) setError(streamError);
        setStreamingContent("");
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          console.error("[designAssistant] chat request failed:", err);
          setError(
            "I couldn't reach our design assistant. Please try again, or call us at (434) 973-1691."
          );
        }
        setStreamingContent("");
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, messages, sessionId]
  );

  return {
    messages,
    streamingContent,
    isStreaming,
    error,
    sendMessage,
    resetConversation,
    stopStreaming,
    sessionId,
  };
}
