import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    https: {
      //todo: replace the hardcoded paths
      key: fs.readFileSync(path.resolve(__dirname, "../logic/ssl/key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "../logic/ssl/cert.pem")),
    },
    port: 5173,
  },
});
