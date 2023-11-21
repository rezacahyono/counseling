import dynamic from 'next/dynamic'
import React from 'react'

const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)
const TableListActionSchool = dynamic(
  () => import('@/components/tables/table-list-action-school'),
  { ssr: false }
)

export default async function ActionSchoolPage() {
  const fetchAllActionSchool = (
    await import('@/lib/actions/action-school.action')
  ).fetchAllActionSchool

  const actionSchools = await fetchAllActionSchool()

  return (
    <div className='w-full px-6 py-6 mx-auto'>
      <div className='pb-4'>
        <Breadcrumbs />
      </div>
      <TableListActionSchool actionSchools={actionSchools} />
    </div>
  )
}

