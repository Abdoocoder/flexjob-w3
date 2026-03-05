import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const arabicSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://flexjob.sa'),
  title: 'فلكس جوب - سوق العمل المرن',
  description: 'تواصل مع فرص عمل مرنة. ابحث عن وظائف مؤقتة وبدوام جزئي أو وظّف عمالاً موثوقين لنشاطك التجاري.',
  keywords: ['عمل مرن', 'وظائف السعودية', 'دوام جزئي', 'عمل حر', 'توظيف'],
  authors: [{ name: 'FlexJob Team' }],
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://flexjob.sa',
    siteName: 'فلكس جوب',
    title: 'فلكس جوب - سوق العمل المرن',
    description: 'تواصل مع فرص عمل مرنة. ابحث عن وظائف مؤقتة وبدوام جزئي أو وظّف عمالاً موثوقين لنشاطك التجاري.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'فلكس جوب',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فلكس جوب - سوق العمل المرن',
    description: 'تواصل مع فرص عمل مرنة. ابحث عن وظائف مؤقتة وبدوام جزئي أو وظّف عمالاً موثوقين لنشاطك التجاري.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/flexjob-logo.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0d9488',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={arabicSans.variable}>
      <body className={`${arabicSans.className} antialiased`}>
        {children}
        <Toaster position="top-center" />
        <Analytics />
      </body>
    </html>
  )
}
