import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    base: process.env.VITE_BASE || "/",
    plugins: [react()],
    server: {
      port: 56823,
    },
    resolve: {
      alias: {
        src: resolve(__dirname, "src"),
      },
    },
  };
});
