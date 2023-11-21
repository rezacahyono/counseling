'use client'
import { Card, Chip, Listbox, ListboxItem } from '@nextui-org/react'
import { IoIosArrowForward } from 'react-icons/io'
import React from 'react'

const items = [
  {
    nis: '2011500111',
    name: 'Muhamad Reza Cahyono',
    poinTotal: 20,
  },
  {
    nis: '2011500222',
    name: 'Muhamad Reza Cahyono',
    poinTotal: 20,
  },
  {
    nis: '2011500333',
    name: 'Muhamad Reza Cahyono',
    poinTotal: 20,
  },
  {
    nis: '2011500444',
    name: 'Muhamad Reza Cahyono',
    poinTotal: 20,
  },
]

export default function ListBoxLatestOffense() {
  return (
    <div className='w-full max-w-full px-3  lg:w-1/3 lg:flex-none mb-6 lg:mb-0 '>
      <Card className='h-full p-2 shadow-soft-xl'>
        <div className='text-center'>
          <h5 className='font-bold text-lg text-default-800 py-4 md:py-2'>
            Pelanggaran Terakhir
          </h5>
        </div>
        <Listbox
          items={items}
          aria-label='Dynamic Actions'
          // onAction={(key) => alert(key)}
        >
          {item => (
            <ListboxItem
              key={item.nis}
              endContent={
                <IoIosArrowForward className='text-xl text-default-400' />
              }
              startContent={
                <Chip color='danger' variant='shadow'>
                  {item.poinTotal}
                </Chip>
              }
              description={item.nis}
            >
              <p>{item.name}</p>
            </ListboxItem>
          )}
        </Listbox>
      </Card>
    </div>
  )
}

