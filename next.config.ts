import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Future: Add image domains for project imagery
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
