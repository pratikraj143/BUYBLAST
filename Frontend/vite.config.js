// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        // Add the module name that's causing the warning here
        'the-module-name',
        // You can also use regex patterns if needed
        /^some-package\/.*/,
      ],
    },
  },
})
