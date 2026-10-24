import type { NextConfig } from "next";

/** Pro GitHub Pages: statické stránky v podsložce s názvem repozitáře (BASE_PATH=/nazev-repa). */
const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Samostatná složka pro kontrolní build, aby nepřepsal běžící vývojový server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Celý web je předgenerovaný (hra běží v prohlížeči a ukládá do localStorage), takže stačí statický hosting.
  ...(process.env.STATIC_EXPORT ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } } : {}),
  basePath,
};

export default nextConfig;
