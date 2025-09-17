import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist',
  basePath: process.env.NODE_ENV === 'production' ? '/aagag-web' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/aagag-web' : '',
};

export default nextConfig;
