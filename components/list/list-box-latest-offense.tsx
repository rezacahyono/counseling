'use client'
import { poinColorMap } from '@/constants/color'
import { Chip, Listbox, ListboxItem } from '@nextui-org/react'
import { Criteria, Offense, Student, Subcriteria } from '@prisma/client'
import React from 'react'

type Props = {
  offenses: ({
    student: Student
    criteria: Criteria
    subcriteria: Subcriteria
  } & Offense)[]
}

export default function ListBoxLatestOffense({ offenses }: Props) {
  return (
    <div className='w-full max-w-full px-3  lg:w-1/3 lg:flex-none mb-6 lg:mb-0 '>
      <div className='h-full shadow-soft-xl rounded-xl bg-content1 py-2 px-4'>
        <div className='text-center'>
          <h5 className='font-bold text-lg text-default-800 py-4 md:py-2'>
            Pelanggaran Terakhir
          </h5>
        </div>
        <Listbox items={offenses} aria-label='Dynamic Actions'>
          {item => (
            <ListboxItem
              key={item.id}
              startContent={
                <Chip
                  color={poinColorMap(item.subcriteria.poin)}
                  variant='shadow'
                  className='mr-4'
                >
                  {item.subcriteria.poin}
                </Chip>
              }
              description={`${item.criteria.name} - ${item.subcriteria.name}`}
              aria-label={item.id}
            >
              <div className='flex gap-2'>
                <p className='text-xs leading-6 text-default-600'>
                  {item.student.nis}
                </p>
                <p>{item.student.name}</p>
              </div>
            </ListboxItem>
          )}
        </Listbox>
      </div>
    </div>
  )
}

