import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    exclude: ['node_modules', 'e2e/**'],
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    testTimeout: 30000,
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
