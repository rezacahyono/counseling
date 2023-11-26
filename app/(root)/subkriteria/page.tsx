import dynamic from 'next/dynamic'
import React from 'react'

const PageWrapper = dynamic(() => import('@/components/wrapper/page-wrapper'))

const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)

const TableListSubcriteria = dynamic(
  () => import('@/components/tables/table-list-subcriteria'),
  { ssr: false }
)

export default async function SubcriteriaPage() {
  const { fetchAllSubcriteria } = await import(
    '@/lib/actions/subcriteria.action'
  )
  const { fetchAllCriteria } = await import('@/lib/actions/criteria.action')
  const subcriterias = await fetchAllSubcriteria({ criteria: true })
  const criterias = await fetchAllCriteria()

  return (
    <PageWrapper>
      <div className='w-full px-6 py-6 mx-auto'>
        <div className='pb-4'>
          <Breadcrumbs />
        </div>
        <h3 className='text-2xl font-bold leading-tight text-default-800 py-2'>
          Semua Subkriteria
        </h3>
        <TableListSubcriteria
          subcriterias={subcriterias}
          criterias={criterias}
        />
      </div>
    </PageWrapper>
  )
}

