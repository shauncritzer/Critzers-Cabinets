import { Fragment, type ReactNode, useMemo } from "react";

/**
 * Minimal markdown renderer for chat bubbles.
 *
 * The AI sales agent only ever produces conversational prose with the
 * occasional bold phrase, link, or short list. A full markdown pipeline
 * (Streamdown pulls in mermaid, shiki and katex) would add roughly 900 KB to
 * the widget bundle for features we never use, so we render the small subset we
 * actually need and escape everything else.
 *
 * Supported: **bold**, *italic*, `code`, [links](url), bare URLs, bullet lists,
 * numbered lists, and paragraph breaks.
 */

const INLINE_PATTERN =
  /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_|`[^`\n]+`|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s<>()]+)/g;

function isSafeUrl(url: string): boolean {
  if (url.startsWith("/") || url.startsWith("#")) return true;
  if (url.startsWith("mailto:") || url.startsWith("tel:")) return true;
  return /^https?:\/\//i.test(url);
}

function renderLink(href: string, label: string, key: string): ReactNode {
  if (!isSafeUrl(href)) return <Fragment key={key}>{label}</Fragment>;

  const isInternal = href.startsWith("/") || href.startsWith("#");

  return (
    <a
      key={key}
      href={href}
      {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      className="font-medium text-primary underline underline-offset-2 hover:no-underline"
    >
      {label}
    </a>
  );
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  INLINE_PATTERN.lastIndex = 0;

  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-i${index++}`;

    if (
      (token.startsWith("**") && token.endsWith("**")) ||
      (token.startsWith("__") && token.endsWith("__"))
    ) {
      nodes.push(
        <strong key={key} className="font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-background/70 px-1 py-0.5 text-[0.85em]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (linkMatch) {
        nodes.push(renderLink(linkMatch[2], linkMatch[1], key));
      } else {
        nodes.push(token);
      }
    } else if (/^https?:\/\//i.test(token)) {
      nodes.push(renderLink(token, token, key));
    } else {
      // Single * or _ emphasis
      nodes.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

type Block =
  | { type: "paragraph"; lines: string[] }
  | { type: "bullets"; items: string[] }
  | { type: "numbers"; items: string[] };

function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n");

  let current: Block | null = null;

  const flush = () => {
    if (current) blocks.push(current);
    current = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flush();
      continue;
    }

    const bulletMatch = line.match(/^[-*+]\s+(.*)$/);
    const numberMatch = line.match(/^\d+[.)]\s+(.*)$/);

    if (bulletMatch) {
      if (current?.type !== "bullets") {
        flush();
        current = { type: "bullets", items: [] };
      }
      current.items.push(bulletMatch[1]);
      continue;
    }

    if (numberMatch) {
      if (current?.type !== "numbers") {
        flush();
        current = { type: "numbers", items: [] };
      }
      current.items.push(numberMatch[1]);
      continue;
    }

    // Strip heading markers; the agent shouldn't use them, but be tolerant.
    const plain = line.replace(/^#{1,6}\s+/, "");

    if (current?.type !== "paragraph") {
      flush();
      current = { type: "paragraph", lines: [] };
    }
    current.lines.push(plain);
  }

  flush();
  return blocks;
}

export default function ChatMarkdown({ content }: { content: string }) {
  const blocks = useMemo(() => parseBlocks(content), [content]);

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {blocks.map((block, blockIndex) => {
        if (block.type === "bullets") {
          return (
            <ul
              key={blockIndex}
              className="ml-4 list-disc space-y-1 marker:text-muted-foreground"
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {renderInline(item, `b${blockIndex}-${itemIndex}`)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "numbers") {
          return (
            <ol
              key={blockIndex}
              className="ml-4 list-decimal space-y-1 marker:text-muted-foreground"
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {renderInline(item, `n${blockIndex}-${itemIndex}`)}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={blockIndex}>
            {block.lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 && <br />}
                {renderInline(line, `p${blockIndex}-${lineIndex}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
