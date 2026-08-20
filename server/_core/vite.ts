import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { injectSeo } from "./seo";

/**
 * Requests that should never receive the SPA shell (and therefore never need
 * SEO injection).
 */
function isAssetRequest(url: string): boolean {
  const pathname = url.split("?")[0];
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/@") ||
    pathname.startsWith("/src/") ||
    pathname.startsWith("/node_modules/") ||
    /\.[a-z0-9]{2,5}$/i.test(pathname)
  );
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      let page = await vite.transformIndexHtml(url, template);
      // Route-aware meta tags, structured data, and prerendered content so the
      // first response is crawlable even before React hydrates.
      // Use originalUrl rather than req.path: under the catch-all static
      // middleware Express may consume the path and expose req.path as "/".
      page = injectSeo(page, req.originalUrl || url);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  const indexPath = path.resolve(distPath, "index.html");
  // Read the built shell once; route-specific SEO data is applied per request.
  let indexTemplate = "";
  try {
    indexTemplate = fs.readFileSync(indexPath, "utf-8");
  } catch {
    console.error(`Could not read ${indexPath}`);
  }

  // `index: false` prevents express.static from short-circuiting "/" with the
  // raw index.html, which would bypass SEO injection on the homepage.
  app.use(express.static(distPath, { index: false }));

  // fall through to index.html if the file doesn't exist
  app.use("*", (req, res) => {
    if (!indexTemplate) {
      res.sendFile(indexPath);
      return;
    }
    if (isAssetRequest(req.originalUrl)) {
      res.status(404).end();
      return;
    }
    // `req.originalUrl` preserves the requested SPA route after this
    // catch-all middleware has matched it; req.path can otherwise be "/".
    const html = injectSeo(indexTemplate, req.originalUrl);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  });
}
