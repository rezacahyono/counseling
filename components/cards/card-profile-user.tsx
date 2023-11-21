'use client'
import { User } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function CardProfileUser() {
  const { data: session } = useSession()

  return (
    <User
      className='w-auto max-w-full px-4'
      name={session?.user?.name}
      description={<p>{session?.user?.email}</p>}
      classNames={{
        name: 'text-xl font-medium text-default-800',
        description: 'text-base font-normal text-default-500',
      }}
      avatarProps={{
        src: `${session?.user?.image || ''}`,
        name: `${session?.user?.name || ''}`,
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

