'use client'
import { useSidebarContext } from '@/hook/sidebar-context'
import { Divider, Image } from '@nextui-org/react'
import classNames from 'classnames'
import Link from 'next/link'
import React from 'react'
import {
  BiSolidCategoryAlt,
  BiSolidShieldAlt2,
  BiSolidTrafficCone,
  BiSolidRocket,
  BiSolidFolder,
  BiSolidUser,
  BiSolidFolderOpen,
} from 'react-icons/bi'
import SidebarItem from './sidebar-item'
import { usePathname } from 'next/navigation'
import SidebarMenu from './sidebar-menu'
import CollapseItem from './collapse-item'

const itemMenu = [
  { label: 'Kriteria', href: '/kriteria', icon: <BiSolidFolder size={15} /> },
  {
    label: 'Subkriteria',
    href: '/subkriteria',
    icon: <BiSolidFolderOpen size={15} />,
  },
]

export default function Sidebar() {
  const { collapsed, setCollapsed } = useSidebarContext()
  const pathName = usePathname()
  return (
    <div className='box-border h-screen z-50 sticky top-0'>
      {collapsed && (
        <div
          className='backdrop-blur-sm bg-background/30 fixed inset-0 z-40 transition-opacity duration-300 ease-linear opacity-80 lg:hidden lg:z-auto lg:opacity-100'
          onClick={setCollapsed}
        />
      )}
      <div
        className={classNames({
          'transition-transform duration-300 ease-linear bg-background h-full fixed -translate-x-full w-64 flex-shrink-0 z-50 overflow-y-auto flex flex-col py-5 px-3 lg:ml-0 lg:flex lg:static lg:h-screen lg:translate-x-0 scrollbar-hide':
            true,
          'flow-root bg-background ml-0 translate-x-0': collapsed,
        })}
      >
        <div className='flex items-center justify-center'>
          <Link href='/'>
            <Image
              src='/img/logo.webp'
              alt='Logo'
              className='h-auto w-auto rounded-full'
              width={100}
              height={100}
            />
          </Link>
        </div>
        <div className='flex flex-col gap-4 mt-6 px-2'>
          <SidebarItem
            title='Beranda'
            icon={<BiSolidCategoryAlt size={22} />}
            isActive={pathName === '/'}
            href='/'
          />
          <SidebarMenu title='Main Menu'>
            <CollapseItem
              icon={<BiSolidFolder size={22} />}
              title='Kriteria'
              items={itemMenu}
            />
            <SidebarItem
              title='Siswa'
              icon={<BiSolidUser size={22} />}
              isActive={pathName.includes('/siswa')}
              href='/siswa'
            />
            <SidebarItem
              title='Tindakan'
              icon={<BiSolidShieldAlt2 size={22} />}
              isActive={pathName.includes('/tindakan')}
              href='/tindakan'
            />
            <SidebarItem
              title='Pelanggaran'
              icon={<BiSolidTrafficCone size={22} />}
              isActive={pathName.includes('/pelanggaran')}
              href='/pelanggaran'
            />
            <SidebarItem
              title='Rekomendasi'
              icon={<BiSolidRocket size={22} />}
              isActive={pathName.includes('/rekomendasi')}
              href='/rekomendasi'
            />
          </SidebarMenu>
        </div>
      </div>
    </div>
  )
}

