import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function apiMiddlewarePlugin(): Plugin {
  return {
    name: "api-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/api/send-email" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              const { handler } = await import("./netlify/functions/send-email.ts");
              const event = {
                httpMethod: "POST",
                path: "/api/send-email",
                headers: req.headers as Record<string, string>,
                body,
                queryStringParameters: null,
                isBase64Encoded: false,
              };
              const result = await handler(event as any, {} as any, () => {});
              if (result) {
                res.statusCode = result.statusCode;
                if (result.headers) {
                  Object.entries(result.headers).forEach(([k, v]) => {
                    res.setHeader(k, String(v));
                  });
                }
                res.end(result.body);
                return;
              }
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "No response from handler" }));
            } catch (e: unknown) {
              const message = e instanceof Error ? e.message : String(e);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: message }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), apiMiddlewarePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
