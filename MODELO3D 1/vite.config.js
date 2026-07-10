import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  base: './', // Ensures compatibility with GitHub Pages
  server: {
    port: 3000,
    host: true, // Exposes on local network IP so mobile AR works
    open: true
  },
  build: {
    outDir: '../Voto_Informado/public/simulador3d',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})
