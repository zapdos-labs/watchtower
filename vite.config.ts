import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import { DEFS } from './definitions';

export default defineConfig({
  plugins: [devtools(), solidPlugin(), tailwindcss()],
  server: {
    port: DEFS.port,
    proxy: {
      '/ws': {
        target: `ws://localhost:${DEFS.media_server.port}`,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'esnext',
  },
});
