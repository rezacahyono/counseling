import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('@/components/navigation/navbar'), {
  ssr: false,
})
const Sidebar = dynamic(() => import('@/components/navigation/sidebar'), {
  ssr: false,
})
const Providers = dynamic(() => import('@/app/providers'))

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Konseling | MAN 19 Jakarta',
  description: 'Konseling App MAN 19 Jakarta',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        <Providers>
          <main className='flex'>
            <Sidebar />
            <div className='overflow-x-clip flex flex-col flex-auto'>
              <Navbar />
              <section>{children}</section>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  )
}

