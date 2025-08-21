import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextUIProvider } from '@nextui-org/react'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cleaning Services Marketplace',
  description: 'Find professional cleaning services near you',
  keywords: 'cleaning, car wash, detailing, morocco, casablanca',
  authors: [{ name: 'Cleaning Marketplace' }],
  openGraph: {
    title: 'Cleaning Services Marketplace',
    description: 'Find professional cleaning services near you',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextUIProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </NextUIProvider>
      </body>
    </html>
  )
}
