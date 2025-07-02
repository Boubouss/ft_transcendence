import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [tailwindcss()],
   resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Exemple : @/components → src/components
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // remplace par ton URL backend HTTPS
        changeOrigin: true,
        secure: false, // si ton backend utilise un certificat auto-signé
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
