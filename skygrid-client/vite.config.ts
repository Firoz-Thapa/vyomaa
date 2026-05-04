import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['satellite.js', 'satellite.js/wasm-build'],
  },
  build: {
    rollupOptions: {
      external: ['satellite.js/wasm-build', 'satellite.js/wasm-build/base-release', 'satellite.js/wasm-build/pthreads-release'],
      output: {
        format: 'es',
      },
    },
  },
  worker: {
    format: 'es',
  },
})
