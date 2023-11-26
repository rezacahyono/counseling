import { fetchAllRecomendation } from '@/lib/actions/recomendation.action'
import dynamic from 'next/dynamic'
import React from 'react'

const PageWrapper = dynamic(() => import('@/components/wrapper/page-wrapper'))

const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)

const TableListRecomendation = dynamic(
  () => import('@/components/tables/table-list-recomendation'),
  { ssr: false }
)

export default async function RecomendationPage() {
  const recomendations = await fetchAllRecomendation({
    student: true,
    actionSchool: true,
  })
  return (
    <PageWrapper>
      <div className='w-full px-6 py-6 mx-auto'>
        <div className='pb-4'>
          <Breadcrumbs />
        </div>
        <h3 className='text-2xl font-bold leading-tight text-default-800 py-2'>
          Semua Rekomendasi
        </h3>
        <TableListRecomendation recomendations={recomendations} />
      </div>
    </PageWrapper>
  )
}

