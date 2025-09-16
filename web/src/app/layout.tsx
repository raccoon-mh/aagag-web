import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';

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
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
