import {
  BiSolidFolder,
  BiSolidFolderOpen,
  BiSolidHappyHeartEyes,
  BiSolidError,
} from 'react-icons/bi'
import React from 'react'
import dynamic from 'next/dynamic'
import { fetchAllCriteria } from '@/lib/actions/criteria.action'
import { fetchAllSubcriteria } from '@/lib/actions/subcriteria.action'
import { fetchAllStudent } from '@/lib/actions/student.action'
import { fetchAllOffense } from '@/lib/actions/offense.action'
import { fetchAllRecomendation } from '@/lib/actions/recomendation.action'

const PageWrapper = dynamic(() => import('@/components/wrapper/page-wrapper'))
const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)
const CardProfileSchool = dynamic(
  () => import('@/components/cards/card-profile-school')
)
const CardVisiSchool = dynamic(
  () => import('@/components/cards/card-visi-school')
)
const CardMini = dynamic(() => import('@/components/cards/card-mini'))

const ListBoxLatestOffense = dynamic(
  () => import('@/components/list/list-box-latest-offense')
)

const TableHighestOffense = dynamic(
  () => import('@/components/tables/table-highest-offense')
)

export default async function DashboardPage() {
  const offenses = await fetchAllOffense(
    {
      criteria: true,
      student: true,
      subcriteria: true,
    },
    5
  )
  const recomendations = await fetchAllRecomendation(
    {
      student: true,
      actionSchool: true,
    },
    { totalPoin: 'asc' },
    5
  )
  const criteriaLength = (await fetchAllCriteria()).length
  const subCriteriaLength = (await fetchAllSubcriteria()).length
  const studentLength = (await fetchAllStudent()).length
  const offenseLength = offenses.length

  return (
    <PageWrapper>
      <div className='w-full px-6 py-6 mx-auto'>
        <div className='pb-4'>
          <Breadcrumbs />
        </div>
        <div className='flex flex-wrap -mx-3'>
          <CardMini
            title='Kriteria'
            count={`${criteriaLength}`}
            prefix='Total'
            icon={<BiSolidFolder size={25} />}
          />
          <CardMini
            title='Subkriteria'
            count={`${subCriteriaLength}`}
            prefix='Total'
            icon={<BiSolidFolderOpen size={25} />}
          />
          <CardMini
            title='Siswa'
            count={`${studentLength}`}
            prefix='Total'
            icon={<BiSolidHappyHeartEyes size={25} />}
          />
          <CardMini
            title='Pelanggaran'
            count={`${offenseLength}`}
            prefix='Total'
            icon={<BiSolidError size={25} />}
          />
        </div>
        <div className='flex flex-wrap mt-6 -mx-3'>
          <CardVisiSchool />
          <CardProfileSchool />
        </div>
        <div className='flex flex-wrap my-6 -mx-3'>
          <ListBoxLatestOffense offenses={offenses} />
          <TableHighestOffense recomendations={recomendations} />
        </div>
      </div>
    </PageWrapper>
  )
}

