import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  // Ensure output is static for Vercel deployment
  output: 'standalone',
  // Add trailing slash to URLs for consistency
  trailingSlash: true,
  // Ensure proper handling of URLs
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
