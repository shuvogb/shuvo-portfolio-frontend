import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Shuvo Molla — Sociology & Social Work Researcher',
  description:
    'Portfolio of Shuvo Molla, a Sociology and Social Work undergraduate with hands-on experience in social research, data collection, and community development.',
  keywords: [
    'Shuvo Molla',
    'sociology researcher',
    'social work',
    'community development',
    'Bangladesh',
    'SPSS',
    'social research',
  ],
  authors: [{ name: 'Shuvo Molla', url: 'https://shuvomolla.com' }],
  openGraph: {
    title: 'Shuvo Molla — Sociology & Social Work Researcher',
    description:
      'Portfolio of Shuvo Molla — Social Research · Community Development · Climate Activism',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shuvo Molla — Sociology & Social Work Researcher',
    description: 'Portfolio of Shuvo Molla — Social Research · Community Development',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
