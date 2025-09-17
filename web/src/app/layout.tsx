import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Script from 'next/script';
import { generateWebsiteStructuredData, generateOrganizationStructuredData } from '@/lib/structured-data';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: '애객 세끼 With Web Finder - 3분 안에 맛집 찾기',
    template: '%s | 애객 세끼 With Web Finder'
  },
  description: '전국 15,000개 맛집을 3분 안에 찾는 가장 빠른 방법. 지역별, 태그별 필터링으로 광고 없는 깔끔한 맛집 검색 서비스. 서울, 부산, 대구 등 전국 맛집 정보를 한눈에 확인하세요.',
  keywords: [
    '맛집', '식당', '음식점', '검색', '추천', '한국', '서울', '부산', '대구', '지역별',
    '맛집 검색', '맛집 추천', '식당 검색', '음식점 추천', '한국 맛집', '서울 맛집',
    '부산 맛집', '대구 맛집', '광주 맛집', '대전 맛집', '인천 맛집', '맛집 리스트',
    '맛집 정보', '식당 정보', '음식점 정보', '맛집 찾기', '맛집 앱', '맛집 사이트'
  ],
  authors: [{ name: '애객 세끼 With Web Finder Team' }],
  creator: '애객 세끼 With Web Finder',
  publisher: '애객 세끼 With Web Finder',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://raccoon-mh.github.io/aagag-web/',
    siteName: '애객 세끼 With Web Finder',
    title: '애객 세끼 With Web Finder - 3분 안에 맛집 찾기',
    description: '전국 15,000개 맛집을 3분 안에 찾는 가장 빠른 방법. 지역별, 태그별 필터링으로 광고 없는 깔끔한 맛집 검색 서비스.',
    images: [
      {
        url: 'https://raccoon-mh.github.io/aagag-web/og-image.svg',
        width: 1200,
        height: 630,
        alt: '애객 세끼 With Web Finder - 맛집 검색 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '애객 세끼 With Web Finder - 3분 안에 맛집 찾기',
    description: '전국 15,000개 맛집을 3분 안에 찾는 가장 빠른 방법. 지역별, 태그별 필터링으로 광고 없는 깔끔한 맛집 검색 서비스.',
    images: ['https://raccoon-mh.github.io/aagag-web/og-image.svg'],
    creator: '@aagag_web',
  },
  alternates: {
    canonical: 'https://raccoon-mh.github.io/aagag-web/',
  },
  category: 'food',
  classification: '맛집 검색 서비스',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': '애객 세끼',
    'mobile-web-app-capable': 'yes',
    'theme-color': '#000000',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GTM_ID = 'GTM-NJJ9ZMNX';
  const GA4_MEASUREMENT_ID = 'G-0H46HXW416';

  return (
    <html suppressHydrationWarning>
      <head>
        {/* 구조화된 데이터 */}
        <Script
          id="structured-data-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteStructuredData()),
          }}
        />
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationStructuredData()),
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function (w, d, s, l, i) {
                w[l] = w[l] || []; w[l].push({
                  'gtm.start':
                    new Date().getTime(), event: 'gtm.js'
                }); var f = d.getElementsByTagName(s)[0],
                  j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                    'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
              })(window, document, 'script', 'dataLayer', '${GTM_ID}');
            `,
          }}
        />

        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="ga4-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_MEASUREMENT_ID}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
