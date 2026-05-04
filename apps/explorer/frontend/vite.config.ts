import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// @icp-sdk/bindgen Vite plugin
import { icpBindgen } from "@icp-sdk/bindgen/plugins/vite";

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    icpBindgen({
      didFile: path.resolve(
        __dirname,
        "../canisters/explorer_bff/explorer_bff.did",
      ),
      outDir: path.resolve(__dirname, "src/bindings/explorer_bff"),
      output: {
        declarations: {
          typescript: true,
          flat: true,
        },
      },
    }),
    // Dev-server cookie shim: inject ic_env cookie so safeGetCanisterEnv()
    // works when served by Vite directly instead of the asset canister.
    // Only runs during `vite dev`, not `vite build`.
    ...(command === "serve"
      ? [
          {
            name: "ic-env-cookie-shim",
            configureServer(server: import("vite").ViteDevServer) {
              server.middlewares.use((_req, res, next) => {
                const localRootKey = new Uint8Array(64).fill(0);
                const env: Record<string, unknown> = {
                  IC_ROOT_KEY: Array.from(localRootKey),
                };
                const cookieValue = encodeURIComponent(JSON.stringify(env));
                const existingCookies = (_req as import("http").IncomingMessage).headers.cookie ?? "";
                if (!existingCookies.includes("ic_env=")) {
                  (res as import("http").ServerResponse).setHeader(
                    "Set-Cookie",
                    `ic_env=${cookieValue}; Path=/; SameSite=Strict`,
                  );
                }
                next();
              });
            },
          },
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));
