import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
//import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    tailwindcss(),
    // Si tu veux que mkcert gère automatiquement les certificats :
    //mkcert(),
  ],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, 'src') + '/',
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/cert.crt')),
    },
    //proxy: {
    //  '/api': {
    //    target: 'http://localhost:3001',
    //    changeOrigin: true,
    //    secure: false,
    //    rewrite: (path) => path.replace(/^\/api/, "")
    //  }
    //}
  }
});
