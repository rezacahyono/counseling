import { fetchAllCriteria } from '@/lib/actions/criteria.action'
import { fetchAllOffense } from '@/lib/actions/offense.action'
import { fetchAllStudent } from '@/lib/actions/student.action'
import dynamic from 'next/dynamic'
import React from 'react'

const PageWrapper = dynamic(() => import('@/components/wrapper/page-wrapper'))

const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)

const TableListOffense = dynamic(
  () => import('@/components/tables/table-list-offense'),
  {
    ssr: false,
  }
)

export default async function OffensePage() {
  const offenses = await fetchAllOffense({
    criteria: true,
    student: true,
    subcriteria: true,
  })

  const criterias = await fetchAllCriteria({
    subcriteria: true,
  })
  const students = await fetchAllStudent()

  return (
    <PageWrapper>
      <div className='w-full px-6 py-6 mx-auto'>
        <div className='pb-4'>
          <Breadcrumbs />
        </div>
        <h3 className='text-2xl font-bold leading-tight text-default-800 py-2'>
          Semua Pelanggaran
        </h3>
        <TableListOffense
          offenses={offenses}
          criterias={criterias}
          students={students}
        />
      </div>
    </PageWrapper>
  )
}
