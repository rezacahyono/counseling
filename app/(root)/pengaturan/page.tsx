'use client'
import dynamic from 'next/dynamic'
import React from 'react'

const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)
const CardEditUser = dynamic(() => import('@/components/cards/card-edit-user'))
const CardProfileUser = dynamic(
  () => import('@/components/cards/card-profile-user')
)

export default function SettingPage() {
  return (
    <div className='w-full px-6 py-6 mx-auto'>
      <div className='pb-4'>
        <Breadcrumbs />
      </div>
      <div className='relative bg-[url("/img/curved.webp")] w-full rounded-xl max-h-40 h-screen bg-cover'>
        <span className='absolute inset-y-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-primary to-secondary opacity-70 rounded-xl' />
      </div>
      <div className='relative flex flex-col flex-auto min-w-0 p-4 mx-6 -mt-10 overflow-hidden break-words border-0 rounded-2xl bg-default-200/70 bg-clip-border backdrop-blur-2xl backdrop-saturate-200 shadow-soft-xl'>
        <div className='flex flex-wrap -mx-3'>
          <CardProfileUser />
        </div>
      </div>
      <div className='flex flex-wrap -mx-3 mt-6'>
        <CardEditUser />
      </div>
    </div>
  )
}

