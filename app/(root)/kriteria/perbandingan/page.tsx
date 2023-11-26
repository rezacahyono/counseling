import dynamic from 'next/dynamic'
import React from 'react'

const PageWrapper = dynamic(() => import('@/components/wrapper/page-wrapper'))

const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)

const TableListComparisonCriteria = dynamic(
  () => import('@/components/tables/table-list-comparison-criteria'),
  { ssr: false }
)

export default async function ComparisonCriteriaPage() {
  const { fetchAllComparisonCriteria } = await import(
    '@/lib/actions/comparison-criteria.action'
  )
  const comparisonCriterias = await fetchAllComparisonCriteria()

  return (
    <PageWrapper>
      <div className='w-full px-6 py-6 mx-auto '>
        <div className='pb-4'>
          <Breadcrumbs />
        </div>
        <h3 className='text-2xl font-bold leading-tight text-default-800 py-2'>
          Perhitungan perbandingan kriteria
        </h3>
        <TableListComparisonCriteria
          comparisonCriterias={comparisonCriterias}
        />
      </div>
    </PageWrapper>
  )
}
