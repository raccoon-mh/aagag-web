import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // 정적 내보내기에서 이미지 최적화 비활성화
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
