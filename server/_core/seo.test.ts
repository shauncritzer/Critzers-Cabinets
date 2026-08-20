import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { injectSeo } from "./seo";

const CLIENT_INDEX = path.resolve(
  import.meta.dirname,
  "../..",
  "client",
  "index.html"
);

/** Counts unterminated HTML comments in a document. */
function unterminatedComments(html: string): number {
  const opens = html.split("<!--").length - 1;
  const closes = html.split("-->").length - 1;
  return opens - closes;
}

describe("injectSeo", () => {
  const template = fs.readFileSync(CLIENT_INDEX, "utf-8");

  it("keeps the real client/index.html shell renderable", () => {
    const output = injectSeo(template, "/");

    // The regression: a comment mentioning a literal <title> caused the
    // placeholder strip to eat the comment terminator, commenting out the rest
    // of the document and rendering a blank white page on every route.
    expect(unterminatedComments(output)).toBe(0);
    expect(output).toContain('<div id="root"');
    expect(output).toContain("main.tsx");
    expect(output).toMatch(/<\/body>/i);
  });

  it("does not strip tags that only appear inside comments", () => {
    const html = [
      "<html><head>",
      "<!-- docs mention <title> and <meta name=\"description\"> here -->",
      "<title>Placeholder</title>",
      '<meta name="description" content="placeholder" />',
      '</head><body><div id="root"></div></body></html>',
    ].join("\n");

    const output = injectSeo(html, "/");

    expect(unterminatedComments(output)).toBe(0);
    expect(output).toContain("docs mention <title>");
    expect(output).not.toContain("<title>Placeholder</title>");
    expect(output).not.toContain('content="placeholder"');
  });

  it("emits exactly one title and one description per route", () => {
    const output = injectSeo(template, "/services/cabinet-refacing");

    expect(output.match(/<title>/gi)?.length).toBe(1);
    expect(
      output.match(/<meta name="description"/gi)?.length
    ).toBe(1);
    expect(output).toContain('rel="canonical"');
  });

  it("injects prerendered crawlable content into #root", () => {
    const output = injectSeo(template, "/");

    expect(output).toContain('id="seo-prerender"');
    expect(output).toMatch(/<h1>/);
  });
});
