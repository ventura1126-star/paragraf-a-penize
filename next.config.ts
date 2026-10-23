import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Samostatná složka pro kontrolní build, aby nepřepsal běžící vývojový server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
