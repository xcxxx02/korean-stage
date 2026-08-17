import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: { outDir: 'dist/client' },
  optimizeDeps: { include: ['react', 'react-dom/client'] },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['terminal.local'],
    warmup: { clientFiles: ['./src/main.tsx'] },
  },
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['tests/**', '**/node_modules/**', '**/dist/**'],
  },
})
