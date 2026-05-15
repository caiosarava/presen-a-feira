import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@admin': path.resolve(__dirname, './src/admin'),
      '@mobile': path.resolve(__dirname, './src/mobile'),
    },
  },
  server: {
    port: 5173,
    historyApiFallback: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
