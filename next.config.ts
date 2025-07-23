import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/seed/picsum/**',
      },
      // Pinata IPFS Gateway
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        pathname: '/ipfs/**',
      },
      // Pinata Custom Gateway - specific subdomain
      {
        protocol: 'https',
        hostname: 'gold-necessary-newt-672.mypinata.cloud',
        pathname: '/ipfs/**',
      },
      // Additional IPFS gateways that might be used
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        pathname: '/ipfs/**',
      },
    ],
    // For development, you can also use unoptimized images for IPFS content
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
