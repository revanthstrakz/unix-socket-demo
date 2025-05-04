import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Important for Unix socket and Node.js APIs in Next.js
    if (isServer) {
      config.externals = [...(config.externals || []), 'node-fetch', 'undici'];
    }
    
    return config;
  },
  // External packages configuration
  serverExternalPackages: ['node-fetch', 'undici']
};

export default nextConfig;
