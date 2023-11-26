import { Inter } from 'next/font/google'
import React from 'react'
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'

const Providers = dynamic(() => import('@/app/providers'))

export const metadata = {
  title: 'Konseling | MAN 19 Jakarta',
  description: 'Konseling App MAN 19 Jakarta',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayot({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/img/favicon.ico' />
      </head>
      <body className={inter.className}>
        <Toaster
          toastOptions={{
            success: {
              style: {
                background: 'background',
                color: 'ButtonText',
              },
            },
            loading: {
              style: {
                background: 'background',
                color: 'ButtonText',
              },
            },
            error: {
              style: {
                background: 'background',
                color: 'ButtonText',
              },
            },
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

