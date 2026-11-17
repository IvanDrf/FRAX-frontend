import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [react()],
        server: {
            port: 3000,
            proxy: {
                "/api": {target: env.API_PROXY_TARGET || "http://127.0.0.1:8080", changeOrigin: true},
                "/s3": {
                    target: env.S3_PROXY_TARGET || "http://127.0.0.1:9000",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/s3/, ""),
                },
            },
        },
    };
});
