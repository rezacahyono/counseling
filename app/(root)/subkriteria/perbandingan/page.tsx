import { fetchAllComparisonSubcriteria } from '@/lib/actions/comparison-subcriteria.action'
import { fetchAllCriteria } from '@/lib/actions/criteria.action'
import dynamic from 'next/dynamic'
import React from 'react'

const PageWrapper = dynamic(() => import('@/components/wrapper/page-wrapper'))

const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)

const TableListComparisonSubcriteria = dynamic(
  () => import('@/components/tables/table-list-comparison-subcriteria'),
  { ssr: false }
)

export default async function ComparisonSubcriteriaPage() {
  const criterias = await fetchAllCriteria()
  const comparisonSubcriterias = await fetchAllComparisonSubcriteria()

  return (
    <PageWrapper>
      <div className='w-full px-6 py-6 mx-auto'>
        <div className='pb-4'>
          <Breadcrumbs />
        </div>
        <h3 className='text-2xl font-bold leading-tight text-default-800 py-2'>
          Perhitungan perbandingan subkriteria
        </h3>
        <TableListComparisonSubcriteria
          comparisonSubcriterias={comparisonSubcriterias}
          criterias={criterias}
        />
      </div>
    </PageWrapper>
  )
}

