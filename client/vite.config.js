import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/og-image": "http://localhost:3000",
      "/sitemap.xml": "http://localhost:3000",
    },
  },
});
