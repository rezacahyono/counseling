'use client'
import {
  BreadcrumbItem,
  Breadcrumbs as NextUiBreadcrumbs,
} from '@nextui-org/react'
import { usePathname } from 'next/navigation'
import { BiHome } from 'react-icons/bi'
import React from 'react'

export default function Breadcrumbs({
  nameStudent,
  itemClasses,
}: {
  nameStudent?: string
  itemClasses?: {}
}) {
  const pathNames = usePathname()
    .replace('-', ' ')
    .split('/')
    .filter(path => path)
  if (nameStudent) {
    pathNames.pop()
  }

  return (
    <NextUiBreadcrumbs size='lg' underline='active' itemClasses={itemClasses}>
      <BreadcrumbItem href='/' startContent={<BiHome />}>
        Beranda
      </BreadcrumbItem>
      {pathNames.map((path, index) => (
        <BreadcrumbItem
          key={path}
          href={`/${pathNames.slice(0, index + 1).join('/')}`}
          className='capitalize'
        >
          {path}
        </BreadcrumbItem>
      ))}
      {nameStudent && (
        <BreadcrumbItem className='capitalize'>{nameStudent}</BreadcrumbItem>
      )}
    </NextUiBreadcrumbs>
  )
}

