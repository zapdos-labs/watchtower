import fs from "fs";
import http from "http";
import httpProxy from "http-proxy";
import mime from "mime-types";
import path from "path";
import { useEffect, useState } from "react";
import { fileURLToPath } from "url";
import { mediaConfig } from "../../config";
import { logger } from "../utils/logger";

export default function useProdServer() {
  const [status, setStatus] = useState("Initializing...");
  const [output, setOutput] = useState<string[]>([]);
  const log = logger(setOutput);

  useEffect(() => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const distPath = path.resolve(__dirname, "..", "..", "dist");

    if (!fs.existsSync(distPath)) {
      setStatus("Error");
      log(`Build directory not found. Please run 'bun run build' first.
Expected path: ${distPath}`);
      return;
    }

    // Create a proxy server for WebSocket connections
    const proxy = httpProxy.createProxyServer({
      target: `ws://localhost:${mediaConfig.media_server.port}`,
      ws: true,
      changeOrigin: true,
    });

    const server = http.createServer((req, res) => {
      // Check if it's a WebSocket upgrade request to /ws
      if (
        req.url === "/ws" &&
        req.headers.upgrade &&
        req.headers.upgrade.toLowerCase() === "websocket"
      ) {
        // This should be handled by the proxy WebSocket upgrade
        return;
      }

      const filePath = path.join(
        distPath,
        req.url === "/" ? "index.html" : req.url!
      );

      fs.readFile(filePath, (err, content) => {
        if (err) {
          if (err.code === "ENOENT") {
            fs.readFile(
              path.join(distPath, "index.html"),
              (errIndex, contentIndex) => {
                if (errIndex) {
                  res.writeHead(500);
                  res.end("Server Error");
                } else {
                  res.writeHead(200, { "Content-Type": "text/html" });
                  res.end(contentIndex, "utf-8");
                }
              }
            );
          } else {
            res.writeHead(500);
            res.end(`Server Error: ${err.code}`);
          }
        } else {
          // --- REPLACEMENT LOGIC ---
          // 2. Look up the content type using the file path
          const contentType =
            mime.lookup(filePath) || "application/octet-stream";

          // 3. Set the header and send the response
          res.writeHead(200, { "Content-Type": contentType });
          res.end(content, "utf-8");
        }
      });
    });

    // Handle WebSocket upgrade requests
    server.on("upgrade", (req, socket, head) => {
      if (req.url === "/ws") {
        console.log(
          `Proxying WebSocket connection to ws://localhost:${mediaConfig.media_server.port}`
        );
        proxy.ws(req, socket, head);
      }
    });

    server.listen(mediaConfig.port, () => {
      const url = `http://localhost:${mediaConfig.port}`;
      setStatus("Running in Production");
      log(`Static server is live at ${url}
Serving files from: ${distPath}
WebSocket proxy active at ${url}/ws`);
    });

    return () => {
      server.close();
      proxy.close();
    };
  }, []);

  return {
    status,
    output: output.join("\n"),
  };
}
