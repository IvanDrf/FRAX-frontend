import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
            "/s3": {
                target: "http://localhost:9000", // MinIO / S3
                changeOrigin: true,
                rewrite: (p) => p.replace(/^\/s3/, ""),
            },
        },
    },
});
