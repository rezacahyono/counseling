import {
  BiSolidFolder,
  BiSolidFolderOpen,
  BiSolidHappyHeartEyes,
  BiSolidError,
} from 'react-icons/bi'
import React from 'react'
import TableHighestOffense from '@/components/tables/table-highest-offense'
import ListBoxLatestOffense from '@/components/list/list-box-latest-offense'
import dynamic from 'next/dynamic'

const Breadcrumbs = dynamic(() => import('@/components/breadcrumbs/breadcrumbs'))
const CardProfileSchool = dynamic(() => import('@/components/cards/card-profile-school'))
const CardVisiSchool = dynamic(() => import('@/components/cards/card-visi-school'))
const CardMini = dynamic(() => import('@/components/cards/card-mini'))

export default async function DashboardPage() {

  const fetchAllCriteria = (await import('@/lib/actions/criteria.action')).fetchAllCriteria
  const fetchAllSubcriteria = (await import('@/lib/actions/subcriteria.action')).fetchAllSubcriteria
  const criteriaLength = await (await fetchAllCriteria()).length
  const subCriteriaLength = await (await fetchAllSubcriteria()).length

  return (
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
          count='20'
          prefix='Total'
          icon={<BiSolidHappyHeartEyes size={25} />}
        />
        <CardMini
          title='Pelanggaran'
          count='20'
          prefix='Total'
          icon={<BiSolidError size={25} />}
        />
      </div>
      <div className='flex flex-wrap mt-6 -mx-3'>
        <CardVisiSchool />
        <CardProfileSchool />
      </div>
      <div className='flex flex-wrap my-6 -mx-3'>
        {/* <ListBoxLatestOffense /> */}
        {/* <TableHighestOffense /> */}
      </div>
    </div>
  )
}

