import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.NODE_PATH?.includes(path.join(projectRoot, "node_modules"))) {
  process.env.NODE_PATH = [
    path.join(projectRoot, "node_modules"),
    process.env.NODE_PATH,
  ]
    .filter(Boolean)
    .join(path.delimiter);
  // re-apply NODE_PATH so child processes (e.g. PostCSS) can resolve from project root
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("node:module").Module._initPaths();
}

const nextConfig: NextConfig = {
  reactStrictMode: false,
  turbopack: {
    root: projectRoot,
  },

  experimental: {
    webpackMemoryOptimizations: true,
    webpackBuildWorker: true,
    preloadEntriesOnStart: false,
  },


  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;