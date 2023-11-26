import React from 'react'

import dynamic from 'next/dynamic'
import { fetchAllCriteria } from '@/lib/actions/criteria.action'

const PageWrapper = dynamic(() => import('@/components/wrapper/page-wrapper'))

const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)
const TableListCriteria = dynamic(
  () => import('@/components/tables/table-list-criteria'),
  { ssr: false }
)

export default async function CriteriaPage() {
  const criterias = await fetchAllCriteria()

  return (
    <PageWrapper>
      <div className='w-full px-6 py-6 mx-auto'>
        <div className='pb-4'>
          <Breadcrumbs />
        </div>
        <h3 className='text-2xl font-bold leading-tight text-default-800 py-2'>
          Semua Kriteria
        </h3>
        <TableListCriteria criterias={criterias} />
      </div>
    </PageWrapper>
  )
}

