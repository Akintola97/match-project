import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

// Export a function to dynamically use environment variables
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  const API_BASE_URL = process.env.VITE_BACKEND_URL;

  return defineConfig({
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/user': API_BASE_URL,
        '/sport': API_BASE_URL,
        '/messages': API_BASE_URL,
        '/people': API_BASE_URL,
        '/admin': API_BASE_URL,
      },
    },
  });
};
