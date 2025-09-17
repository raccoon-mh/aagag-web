import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '애객 세끼 With Web Finder ',
  description: 'https://github.com/raccoon-mh/aagag-web',
  keywords: ['맛집', '식당', '음식점', '검색', '추천', '한국', '서울', '지역별'],
  authors: [{ name: '애객 세끼 With Web Finder Team' }],
  openGraph: {
    title: '애객 세끼 With Web Finder ',
    description: 'https://github.com/raccoon-mh/aagag-web',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '애객 세끼 With Web Finder ',
    description: 'https://github.com/raccoon-mh/aagag-web',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GTM_ID = 'GTM-NJJ9ZMNX';

  return (
    <html suppressHydrationWarning>
      <head>
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
