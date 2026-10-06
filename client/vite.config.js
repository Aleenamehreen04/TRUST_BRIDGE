import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// In development, requests to /api are forwarded to the Express server.
export default defineConfig({
  plugins: [react()],
  server: { open: true, proxy: { '/api': 'http://localhost:3001' } }
})
