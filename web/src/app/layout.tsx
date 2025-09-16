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
  description: 'Orgin - https://docs.google.com/spreadsheets/d/1VkCrA0KODJUfr89z8vnWNDJLFz2AtOSGG-JsBLzdGww',
  keywords: ['맛집', '식당', '음식점', '검색', '추천', '한국', '서울', '지역별'],
  authors: [{ name: '애객 세끼 With Web Finder Team' }],
  openGraph: {
    title: '애객 세끼 With Web Finder ',
    description: 'Orgin - https://docs.google.com/spreadsheets/d/1VkCrA0KODJUfr89z8vnWNDJLFz2AtOSGG-JsBLzdGww',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '애객 세끼 With Web Finder ',
    description: 'Orgin - https://docs.google.com/spreadsheets/d/1VkCrA0KODJUfr89z8vnWNDJLFz2AtOSGG-JsBLzdGww',
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
