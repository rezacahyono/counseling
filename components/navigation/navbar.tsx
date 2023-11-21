'use client'

import { useSidebarContext } from '@/hook/sidebar-context'
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarContent,
  NavbarMenuToggle,
  Navbar as NextUiNavbar,
} from '@nextui-org/react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ThemeSwitch from '../switch/theme-switch'

export default function Navbar() {
  const { collapsed, setCollapsed } = useSidebarContext()
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <NextUiNavbar
      maxWidth='full'
      isMenuOpen={collapsed}
      isBlurred
      className='sticky'
    >
      <NavbarContent className='lg:hidden' justify='start'>
        <NavbarMenuToggle
          onClick={setCollapsed}
          aria-label={collapsed ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>
      <NavbarContent justify='end'>
        <ThemeSwitch />
        <Dropdown placement='bottom-end'>
          <DropdownTrigger>
            <Avatar
              isBordered
              as='button'
              className='transition-transform shadow-md shadow-primary'
              color='primary'
              name={session?.user?.name !== null ? session?.user?.name : ''}
              src={session?.user?.image !== null ? session?.user?.image : ''}
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label='Profile Actions'
            variant='flat'
            className='bg-content1'
          >
            <DropdownItem
              key='profile'
              className='h-14 gap-2'
              aria-label='profile'
            >
              <p className='font-semibold'>Masuk sebagai</p>
              <p className='font-semibold'>{session?.user?.email}</p>
            </DropdownItem>
            <DropdownItem
              key='setting'
              aria-label='setting'
              onClick={() => router.push('/pengaturan')}
            >
              Pengaturan
            </DropdownItem>
            <DropdownItem
              aria-label='logout'
              key='logout'
              color='danger'
              onClick={() => {
                signOut()
              }}
            >
              Keluar
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </NextUiNavbar>
  )
}

