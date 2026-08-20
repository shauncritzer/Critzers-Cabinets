import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  Loader2,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
  Square,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ChatMarkdown from "@/components/ChatMarkdown";
import {
  GREETING_MESSAGE,
  SUGGESTED_PROMPTS,
  useSalesAgentChat,
} from "@/hooks/useSalesAgentChat";

const BUBBLE_DISMISSED_KEY = "critzers.designAssistant.bubbleDismissed";
const PANEL_OPEN_KEY = "critzers.designAssistant.open";

/**
 * Floating conversational sales agent.
 *
 * Rendered once for the whole site (lazy-loaded from App.tsx) as a bottom-right
 * bubble that expands into a chat panel. Streams assistant tokens from
 * /api/ai-agent/chat and lets the server handle lead capture.
 */
export default function SalesAgentWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      return window.sessionStorage.getItem(PANEL_OPEN_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [showTeaser, setShowTeaser] = useState(false);
  const [input, setInput] = useState("");
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);

  const {
    messages,
    streamingContent,
    isStreaming,
    error,
    sendMessage,
    resetConversation,
    stopStreaming,
  } = useSalesAgentChat();

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Remember open state across page navigations within the session.
  useEffect(() => {
    try {
      window.sessionStorage.setItem(PANEL_OPEN_KEY, isOpen ? "1" : "0");
    } catch {
      // Non-fatal.
    }
  }, [isOpen]);

  // Show a one-time teaser bubble a few seconds after landing.
  useEffect(() => {
    if (isOpen) return;

    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(BUBBLE_DISMISSED_KEY) === "1";
    } catch {
      dismissed = false;
    }
    if (dismissed || messages.length > 0) return;

    const timer = window.setTimeout(() => setShowTeaser(true), 6000);
    return () => window.clearTimeout(timer);
  }, [isOpen, messages.length]);

  const dismissTeaser = () => {
    setShowTeaser(false);
    try {
      window.localStorage.setItem(BUBBLE_DISMISSED_KEY, "1");
    } catch {
      // Non-fatal.
    }
  };

  const openPanel = () => {
    dismissTeaser();
    setIsOpen(true);
    window.setTimeout(() => textareaRef.current?.focus(), 250);
  };

  // Auto-scroll while the assistant is typing, unless the visitor scrolled up.
  useEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport) return;

    const distanceFromBottom =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;

    if (distanceFromBottom < 160) {
      endOfMessagesRef.current?.scrollIntoView({ block: "end" });
    }
  }, [messages, streamingContent, isOpen]);

  const handleScroll = () => {
    const viewport = scrollRef.current;
    if (!viewport) return;
    const distanceFromBottom =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    setShowJumpToLatest(distanceFromBottom > 200);
  };

  const jumpToLatest = () => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const value = input.trim();
    if (!value || isStreaming) return;

    setInput("");
    await sendMessage(value);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  const handleSuggestion = async (prompt: string) => {
    if (isStreaming) return;
    await sendMessage(prompt);
  };

  const transcript = useMemo(() => {
    const items = messages.map((message, index) => ({
      key: `${message.role}-${index}`,
      role: message.role,
      content: message.content,
    }));

    if (streamingContent) {
      items.push({
        key: "streaming",
        role: "assistant" as const,
        content: streamingContent,
      });
    }

    return items;
  }, [messages, streamingContent]);

  const showSuggestions = messages.length === 0 && !isStreaming;
  const waitingForFirstToken = isStreaming && !streamingContent;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-live="polite"
    >
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="pointer-events-auto absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity sm:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Chat panel */}
      {isOpen && (
        <section
          role="dialog"
          aria-modal="false"
          aria-label="Critzer's design assistant"
          className={cn(
            "pointer-events-auto absolute overflow-hidden bg-card shadow-2xl",
            "inset-x-0 bottom-0 top-0 flex flex-col sm:inset-auto",
            "sm:bottom-24 sm:right-6 sm:top-auto sm:h-[600px] sm:max-h-[calc(100vh-8rem)]",
            "sm:w-[400px] sm:rounded-2xl sm:border sm:border-border",
            "animate-in fade-in slide-in-from-bottom-4 duration-200"
          )}
        >
          {/* Header */}
          <header className="flex shrink-0 items-start justify-between gap-3 bg-secondary px-4 py-3.5 text-secondary-foreground">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/95">
                <img
                  src="/images/logo.png"
                  alt=""
                  className="size-8 object-contain"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">
                  Critzer's Design Assistant
                </span>
                <span className="flex items-center gap-1.5 text-xs text-secondary-foreground/70">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Serving Charlottesville for 40 years
                </span>
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={resetConversation}
                  title="Start over"
                  aria-label="Start a new conversation"
                  className="rounded-md p-2 text-secondary-foreground/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <RefreshCw className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="rounded-md p-2 text-secondary-foreground/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="relative min-h-0 flex-1">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="h-full overflow-y-auto overscroll-contain px-4 py-4"
            >
              <div className="flex flex-col gap-3">
                {/* Greeting is rendered client-side so the panel is never empty */}
                <AssistantBubble content={GREETING_MESSAGE} />

                {transcript.map(item =>
                  item.role === "assistant" ? (
                    <AssistantBubble key={item.key} content={item.content} />
                  ) : (
                    <UserBubble key={item.key} content={item.content} />
                  )
                )}

                {waitingForFirstToken && <TypingIndicator />}

                {showSuggestions && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {SUGGESTED_PROMPTS.map(prompt => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void handleSuggestion(prompt)}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs text-destructive">
                    {error}
                  </div>
                )}

                <div ref={endOfMessagesRef} className="h-px" />
              </div>
            </div>

            {showJumpToLatest && (
              <button
                type="button"
                onClick={jumpToLatest}
                aria-label="Jump to latest message"
                className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-md transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ArrowDown className="mr-1 inline size-3" />
                Latest
              </button>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-border bg-background/80 px-3 pb-3 pt-2.5"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={event => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Tell me about your project..."
                aria-label="Message the design assistant"
                className="max-h-28 min-h-[40px] flex-1 resize-none rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {isStreaming ? (
                <button
                  type="button"
                  onClick={stopStreaming}
                  aria-label="Stop generating"
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-muted/70"
                >
                  <Square className="size-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              )}
            </div>
            <p className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] leading-tight text-muted-foreground">
              <span>Ballpark estimates only &mdash; a designer confirms pricing.</span>
              <a
                href="tel:+14349731691"
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                <Phone className="size-3" />
                (434) 973-1691
              </a>
            </p>
          </form>
        </section>
      )}

      {/* Teaser */}
      {!isOpen && showTeaser && (
        <div className="pointer-events-auto absolute bottom-24 right-4 max-w-[17rem] sm:right-6">
          <div className="relative rounded-2xl rounded-br-sm border border-border bg-card p-3.5 pr-8 shadow-xl">
            <button
              type="button"
              onClick={dismissTeaser}
              aria-label="Dismiss"
              className="absolute right-2 top-2 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
            <p className="text-xs leading-relaxed text-foreground">
              Planning a kitchen or bath project? I can give you a ballpark
              estimate in a couple of minutes.
            </p>
            <button
              type="button"
              onClick={openPanel}
              className="mt-2.5 text-xs font-semibold text-primary hover:underline"
            >
              Start chatting &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Launcher bubble */}
      <button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : openPanel())}
        aria-label={isOpen ? "Close design assistant" : "Open design assistant"}
        aria-expanded={isOpen}
        className={cn(
          "pointer-events-auto absolute bottom-5 right-4 flex items-center gap-2.5 rounded-full bg-primary px-4 py-3.5 text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:shadow-2xl active:scale-95 sm:bottom-6 sm:right-6",
          isOpen && "hidden sm:flex"
        )}
      >
        {isOpen ? (
          <X className="size-5" />
        ) : (
          <>
            <MessageCircle className="size-5" />
            <span className="hidden text-sm font-semibold sm:inline">
              Chat with a designer
            </span>
          </>
        )}
      </button>
    </div>
  );
}

function AssistantBubble({ content }: { content: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
        <img src="/images/logo.png" alt="" className="size-5 object-contain" />
      </span>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-foreground">
        <ChatMarkdown content={content} />
      </div>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
        {content}
      </p>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
        <img src="/images/logo.png" alt="" className="size-5 object-contain" />
      </span>
      <span className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-3.5 py-3">
        <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Thinking...</span>
      </span>
    </div>
  );
}
