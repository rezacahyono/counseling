import dynamic from 'next/dynamic'
import React from 'react'
const Breadcrumbs = dynamic(() => import('@/components/breadcrumbs/breadcrumbs'))

export default function RecomendationPage() {
  return (
    <div className='w-full px-6 py-6 mx-auto'>
      <div className='pb-4'>
        <Breadcrumbs />
      </div>
      
    </div>
  )
}
