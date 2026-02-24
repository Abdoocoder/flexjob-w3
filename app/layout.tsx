import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const _arabicSans = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "600", "700"] });
const _mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: 'فلكس جوب - سوق العمل المرن',
  description: 'تواصل مع فرص عمل مرنة. ابحث عن وظائف مؤقتة وبدوام جزئي أو وظّف عمالاً موثوقين لنشاطك التجاري.',
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
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" />
        <Analytics />
      </body>
    </html>
  )
}
