// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

const isVercel = Boolean(
  process.env.VERCEL || process.env.NOW_BUILDER || process.env.NITRO_PRESET === "vercel",
);

const pwaOutDir = isVercel ? ".vercel/output/static" : ".output/public";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      {
        name: "ensure-pwa-outdir",
        buildStart() {
          try {
            fs.mkdirSync(path.resolve(process.cwd(), pwaOutDir), { recursive: true });
          } catch {
            // ignore if directory creation fails or exists
          }
        },
      },
      VitePWA({
        outDir: pwaOutDir,
        selfDestroying: true,
        registerType: "autoUpdate",
        includeAssets: ["favicon.svg", "robots.txt", "sw.js"],
        workbox: {
          navigateFallback: null,
          runtimeCaching: [
            {
              urlPattern: /^https?.*/,
              handler: "NetworkFirst",
              options: {
                cacheName: "offlineCache",
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 24 * 60 * 60,
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: "module",
        },
        manifest: {
          name: "Youtubiy",
          short_name: "Youtubiy",
          description: "YouTube client with background playback and search",
          theme_color: "#0f0f0f",
          background_color: "#0f0f0f",
          display: "standalone",
          orientation: "any",
          start_url: "/",
          scope: "/",
          icons: [
            {
              src: "/favicon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any",
            },
            {
              src: "/favicon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "maskable",
            },
          ],
        },
      }),
      {
        name: "sync-pwa-sw",
        closeBundle() {
          const swFile = path.resolve(process.cwd(), pwaOutDir, "sw.js");
          if (fs.existsSync(swFile)) {
            const targets = [
              path.resolve(process.cwd(), ".vercel/output/static/sw.js"),
              path.resolve(process.cwd(), ".output/public/sw.js"),
            ];
            for (const target of targets) {
              try {
                fs.mkdirSync(path.dirname(target), { recursive: true });
                fs.copyFileSync(swFile, target);
              } catch {
                // ignore
              }
            }
          }
        },
      },
    ],
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
  },
});
