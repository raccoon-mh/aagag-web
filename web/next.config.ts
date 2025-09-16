import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
  // GitHub Pages 배포를 위한 설정
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist',
  // GitHub Pages의 basePath 설정 (리포지토리 이름이 URL에 포함되는 경우)
  basePath: process.env.NODE_ENV === 'production' ? '/aagag-web' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/aagag-web' : '',
};

export default nextConfig;
