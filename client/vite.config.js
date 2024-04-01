import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/user":"https://news.boltluna.io",
      "/sport":"https://news.boltluna.io",
      "/messages":"https://news.boltluna.io",
      "/people":"https://news.boltluna.io",
      "/admin":"https://news.boltluna.io",
    },
  },
});
