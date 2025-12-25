import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/PomoHub', // Assuming repo name is PomoHub
  reactCompiler: true,
};

export default nextConfig;
