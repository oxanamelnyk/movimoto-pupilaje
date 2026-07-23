import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize build for Turbopack
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  images: {
    qualities: [70, 75],
  },
};

export default nextConfig;
