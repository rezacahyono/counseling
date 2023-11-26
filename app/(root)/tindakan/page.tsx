import dynamic from 'next/dynamic'
import React from 'react'

const PageWrapper = dynamic(() => import('@/components/wrapper/page-wrapper'))

const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)
const TableListActionSchool = dynamic(
  () => import('@/components/tables/table-list-action-school'),
  { ssr: false }
)

export default async function ActionSchoolPage() {
  const { fetchAllActionSchool } = await import(
    '@/lib/actions/action-school.action'
  )

  const actionSchools = await fetchAllActionSchool()

  return (
    <PageWrapper>
      <div className='w-full px-6 py-6 mx-auto'>
        <div className='pb-4'>
          <Breadcrumbs />
        </div>
        <h3 className='text-2xl font-bold leading-tight text-default-800 py-2'>
          Semua Tindakan
        </h3>
        <TableListActionSchool actionSchools={actionSchools} />
      </div>
    </PageWrapper>
  )
}

