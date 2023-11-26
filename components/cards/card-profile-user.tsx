'use client'
import { User as NextUiUser } from '@nextui-org/react'
import { User } from '@prisma/client'
import React from 'react'

export default function CardProfileUser({ user }: { user: User | null }) {
  return (
    <NextUiUser
      className='w-auto max-w-full px-4'
      name={user?.name}
      description={<p>{user?.email}</p>}
      classNames={{
        name: 'text-xl font-medium text-default-800',
        description: 'text-base font-normal text-default-500',
      }}
      avatarProps={{
        src: `${user?.image || ''}`,
        name: `${user?.name || ''}`,
        color: 'default',
        size: 'lg',
        className: 'mr-3',
        radius: 'md',
        isBordered: true,
        classNames: { name: 'text-medium font-normal uppercase' },
      }}
    />
  )
}

