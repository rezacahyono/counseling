import dynamic from 'next/dynamic'
import React from 'react'

const PageWrapper = dynamic(() => import('@/components/wrapper/page-wrapper'))
const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)
const TableListStudent = dynamic(
  () => import('@/components/tables/table-list-student'),
  { ssr: false }
)

export default async function StudentPage() {
  const { fetchAllStudent } = await import('@/lib/actions/student.action')
  const students = await fetchAllStudent()
  return (
    <PageWrapper>
      <div className='w-full px-6 py-6 mx-auto'>
        <div className='pb-4'>
          <Breadcrumbs />
        </div>
        <h3 className='text-2xl font-bold leading-tight text-default-800 py-2'>
          Semua Siswa
        </h3>
        <TableListStudent students={students} />
      </div>
    </PageWrapper>
  )
}

