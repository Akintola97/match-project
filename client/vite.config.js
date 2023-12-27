import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port: 3000,
    proxy: {
      '/user': "http://localhost:5000",
      '/sport': 'http://localhost:5000',
      '/messages': 'http://localhost:5000',
      '/people': 'http://localhost:5000',
    },
  }
})
