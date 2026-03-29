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
  title: 'Portfolio',
  description: 'Personal Portfolio Website',
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
