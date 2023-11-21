'use client'
import { SidebarContext } from '@/hook/sidebar-context'
import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import React from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)

  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <SessionProvider>
        <NextUIProvider navigate={router.push}>
          <SidebarContext.Provider
            value={{
              collapsed: sidebarOpen,
              setCollapsed: handleSidebar,
            }}
          >
            {children}
          </SidebarContext.Provider>
        </NextUIProvider>
      </SessionProvider>
    )
  }

  return (
    <SessionProvider>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider attribute='class' defaultTheme={'light'}>
          <SidebarContext.Provider
            value={{
              collapsed: sidebarOpen,
              setCollapsed: handleSidebar,
            }}
          >
            {children}
          </SidebarContext.Provider>
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  )
}

