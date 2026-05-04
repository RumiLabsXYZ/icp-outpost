var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
// @icp-sdk/bindgen Vite plugin
import { icpBindgen } from "@icp-sdk/bindgen/plugins/vite";
export default defineConfig(function (_a) {
    var command = _a.command;
    return ({
        plugins: __spreadArray([
            react(),
            icpBindgen({
                didFile: path.resolve(__dirname, "../canisters/explorer_bff/explorer_bff.did"),
                outDir: path.resolve(__dirname, "src/bindings/explorer_bff"),
                output: {
                    declarations: {
                        typescript: true,
                        flat: true,
                    },
                },
            })
        ], (command === "serve"
            ? [
                {
                    name: "ic-env-cookie-shim",
                    configureServer: function (server) {
                        server.middlewares.use(function (_req, res, next) {
                            var _a;
                            var localRootKey = new Uint8Array(64).fill(0);
                            var env = {
                                IC_ROOT_KEY: Array.from(localRootKey),
                            };
                            var cookieValue = encodeURIComponent(JSON.stringify(env));
                            var existingCookies = (_a = _req.headers.cookie) !== null && _a !== void 0 ? _a : "";
                            if (!existingCookies.includes("ic_env=")) {
                                res.setHeader("Set-Cookie", "ic_env=".concat(cookieValue, "; Path=/; SameSite=Strict"));
                            }
                            next();
                        });
                    },
                },
            ]
            : []), true),
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
    });
});
