import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas para que los assets carguen desde file:// en Electron
  base: './',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    // En Docker sobre Windows/macOS los eventos del sistema de ficheros no llegan al contenedor
    watch: { usePolling: process.env.VITE_USE_POLLING === 'true' },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
