import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const webRoot = fileURLToPath(new URL("./web/", import.meta.url));
const staticOutput = fileURLToPath(
  new URL("./src/main/resources/static/", import.meta.url),
);

export default defineConfig({
  root: webRoot,
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: process.env.API_PROXY_TARGET || "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: staticOutput,
    emptyOutDir: true,
  },
});
