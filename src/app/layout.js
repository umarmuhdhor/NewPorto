import { Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';
import Providers from './Providers';
import CursorFollower from '@/components/CursorFollower';
import PageCurtain from '@/components/PageCurtain';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
});

export const metadata = {
  title: 'Umar Muhdhor — Mobile & Fullstack Developer',
  description: 'Portfolio of Umar Muhdhor — Junior iOS Developer at Apple Developer Academy @ BINUS. Building mobile apps with Flutter, Swift, and fullstack systems with Node.js, Next.js & Prisma.',
  keywords: ['Umar Muhdhor', 'mobile developer', 'iOS developer', 'Flutter', 'Next.js', 'fullstack', 'portfolio'],
  authors: [{ name: 'Umar Muhdhor' }],
  creator: 'Umar Muhdhor',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://umarmuhdhor.com',
    siteName: 'Umar Muhdhor Portfolio',
    title: 'Umar Muhdhor — Mobile & Fullstack Developer',
    description: 'Building real products — from DPR RI government apps to iOS academy projects. Available for work.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Umar Muhdhor Portfolio',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Umar Muhdhor — Mobile & Fullstack Developer',
    description: 'Building real products — from DPR RI government apps to iOS academy projects. Available for work.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body>
        <PageCurtain />
        <CursorFollower />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
