import { useSidebarContext } from '@/hook/sidebar-context'
import classNames from 'classnames'
import Link from 'next/link'
import React from 'react'

type Props = {
  title: string
  icon: React.ReactNode
  isActive: boolean
  href: string
}

export default function SidebarItem({ title, icon, isActive, href }: Props) {
  const { setCollapsed } = useSidebarContext()
  const handleSidebar = () => {
    if (window.innerWidth < 768) {
      setCollapsed()
    }
  }
  console.log()
  return (
    <Link href={href} className='max-w-full'>
      <div
        onClick={handleSidebar}
        className={classNames({
          'flex box-border gap-3 h-11 min-h-fit items-center px-4 rounded-xl cursor-pointer transition-all duration-200 ease-linear active:scale-95':
            true,
          'bg-primary text-zinc-50 shadow-md shadow-primary': isActive,
          'hover:bg-default-200 hover:text-default-800 text-default-600':
            !isActive,
        })}
      >
        {icon}
        <p
          className={classNames({
            'font-semibold text-base': isActive,
            'font-normal text-base': !isActive,
          })}
        >
          {title}
        </p>
      </div>
    </Link>
  )
}

