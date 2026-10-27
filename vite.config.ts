import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite"; // <-- Crucial import

export default defineConfig({
  plugins: [
    tailwindcss(), // <-- Crucial plugin
    tanstackStart(),
    viteReact(),
    nitro({ preset: "vercel" }),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": "/src",
    },
  },
});