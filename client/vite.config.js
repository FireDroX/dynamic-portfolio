import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const devHtmlDefaults = {
  __TITLE__: "Adrien | Développeur React & Node.js",
  __DESCRIPTION__:
    "Portfolio d’Adrien, développeur web React et Node.js. Découvrez ses projets interactifs.",
  __IMAGE__: "/preview.png",
  __URL__: "http://localhost:5173/",
  __ROBOTS__: "noindex, nofollow",
};

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    command === "serve" && {
      name: "development-seo-defaults",
      transformIndexHtml(html) {
        return Object.entries(devHtmlDefaults).reduce(
          (result, [token, value]) => result.replaceAll(token, value),
          html,
        );
      },
    },
  ].filter(Boolean),
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
}));
