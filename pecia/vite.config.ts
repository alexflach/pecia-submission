import { defineConfig } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            srcDir: "src",
            filename: "sw.ts",
            strategies: "injectManifest",
            injectRegister: "inline",
            manifest: false,
            injectManifest: { injectionPoint: null },
            devOptions: { enabled: true },
        }),
    ],
    test: {
        environment: "jsdom",
        setupFiles: "./test.setup.js",
    },
});
