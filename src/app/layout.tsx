import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '리딩타운 - 책으로 이웃과 연결되는 공간',
  description: '이웃과 책을 교환하며 독서 문화를 만들어가는 소셜 리딩 플랫폼',
  keywords: [
    '리딩타운',
    '책 교환',
    '독서',
    '이웃',
    '도서 공유',
    '독서 커뮤니티',
  ],
  authors: [{ name: '리딩타운' }],
  icons: {
    icon: '/favicon.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: '리딩타운 - 책으로 이웃과 연결되는 공간',
    description: '이웃과 책을 교환하며 독서 문화를 만들어가는 소셜 리딩 플랫폼',
    url: 'https://readingtown.site',
    siteName: '리딩타운',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: '리딩타운 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '리딩타운 - 책으로 이웃과 연결되는 공간',
    description: '이웃과 책을 교환하며 독서 문화를 만들어가는 소셜 리딩 플랫폼',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="min-h-screen-safe">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex justify-center `}
      >
        <Providers>
          <div className="w-full max-w-[430px] bg-white shadow-lg min-h-screen-safe">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
