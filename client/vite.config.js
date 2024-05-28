// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server:{
//     port: 3000,
//     proxy: {
//       '/user': "http://localhost:5000",
//       '/sport': 'http://localhost:5000',
//       '/messages': 'http://localhost:5000',
//       '/people': 'http://localhost:5000',
//       '/admin': 'http://localhost:5000',
//     },
//   }
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from 'vite';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  // Access environment variables using process.env.VITE_*
  const API_BASE_URL = process.env.VITE_API_BASE_URL;

  return defineConfig({
    plugins: [react()],
    server: {
      port: 3001,
      proxy: {
        "/user": API_BASE_URL,
        "/sport": API_BASE_URL,
        "/messages": API_BASE_URL,
        "/people": API_BASE_URL,
        "/admin": API_BASE_URL,
      },
    },
  });
};
