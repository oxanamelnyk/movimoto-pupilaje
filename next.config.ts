import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize build for Turbopack
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};

export default nextConfig;
