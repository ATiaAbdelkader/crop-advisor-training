import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    // The managed preview is HTTPS behind a reverse proxy. Tell the Vite client
    // to reconnect through that public secure WebSocket endpoint rather than
    // falling back to its local development target.
    hmr: {
      server,
      protocol: "wss" as const,
      clientPort: 443,
    },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  // Vite compiles a single client script, while this app is viewed both through
  // the managed HTTPS proxy and through the local HTTP server. Keep the public
  // proxy target for external previews, but make the generated client select a
  // secure default-port WebSocket only when its own page is HTTPS.
  app.use("/@vite/client", async (req, res, next) => {
    if (req.method !== "GET") return next();

    try {
      const transformed = await vite.transformRequest("/@vite/client");
      if (!transformed?.code) return next();

      const clientCode = transformed.code
        .replace(
          'const socketProtocol = "wss" || (importMetaUrl.protocol === "https:" ? "wss" : "ws");',
          'const socketProtocol = importMetaUrl.protocol === "https:" ? "wss" : "ws";'
        )
        .replace(
          "const hmrPort = 443;",
          'const hmrPort = importMetaUrl.protocol === "https:" ? 443 : importMetaUrl.port;'
        );

      res.status(200).set({ "Content-Type": "application/javascript" }).end(clientCode);
    } catch {
      next();
    }
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
      const page = await vite.transformIndexHtml(url, template);
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

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
