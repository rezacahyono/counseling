import React from 'react'

export default function SidebarMenu({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col box-border gap-4'>
      <span className='font-normal text-xs tracking-wider leading-tight'>
        {title}
      </span>
      {children}
    </div>
  )
}

