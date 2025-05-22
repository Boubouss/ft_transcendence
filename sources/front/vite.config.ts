import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      '/auth': {
        target: 'https://api.mondomaine.com', // remplace par ton URL backend HTTPS
        changeOrigin: true,
        secure: false, // si ton backend utilise un certificat auto-signé
      },
    },
  },
});
