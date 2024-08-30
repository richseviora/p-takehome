import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: resolve(__dirname, "../.."),
  envPrefix: ["VITE_", "OTEL_", "HC_"],
});
