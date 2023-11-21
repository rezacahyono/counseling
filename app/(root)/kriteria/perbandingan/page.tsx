import dynamic from 'next/dynamic'
import React from 'react'

const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)
const TableListComparisonCriteria = dynamic(
  () => import('@/components/tables/table-list-comparison-criteria')
)
const TableConsistencyCriteria = dynamic(
  () => import('@/components/tables/table-consistency-criteria')
)

const ComparisonCriteriaPage = async () => {
  const fetchAllComparisonCriteria = (
    await import('@/lib/actions/comparison-kriteria.action')
  ).fetchAllComparisonCriteria
  const comparisonCriterias = await fetchAllComparisonCriteria()
  return (
    <div className='w-full px-6 py-6 mx-auto'>
      <div className='pb-4'>
        <Breadcrumbs />
      </div>
      <h3 className='text-2xl font-bold leading-tight text-default-800 py-2'>
        Perhitungan perbandingan kriteria
      </h3>
      <TableListComparisonCriteria comparisonCriterias={comparisonCriterias} />
      <TableConsistencyCriteria comparisonCriterias={comparisonCriterias} />
    </div>
  )
}

export default ComparisonCriteriaPage

