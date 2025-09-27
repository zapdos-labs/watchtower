import tailwindcss from "@tailwindcss/vite";
import devtools from "solid-devtools/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { getConfig } from "./config";

// The config path is passed when spawning vite process
const config = getConfig({
  from_flags: false,
  from_env: true,
});
export default defineConfig({
  plugins: [devtools(), solidPlugin(), tailwindcss()],
  server: {
    port: config.port,
    proxy: {
      "/ws": {
        target: `ws://localhost:${config.media_server.port}`,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "esnext",
  },
});
