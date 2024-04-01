import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/user":"https://sports.boltluna.io",
      "/sport":"https://sports.boltluna.io",
      "/messages":"https://sports.boltluna.io",
      "/people":"https://sports.boltluna.io",
      "/admin":"https://sports.boltluna.io",
    },
  },
});
