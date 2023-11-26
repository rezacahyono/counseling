import React from 'react'
import { Link } from '@nextui-org/react'

export default function CardProfileSchool() {
  return (
    <div className='px-3 w-full lg:w-4/12'>
      <div className='shadow-soft-xl h-full rounded-xl p-4 bg-content1'>
        <div className='relative h-full overflow-hidden rounded-xl'>
          <div className='relative flex flex-col flex-auto h-full p-4'>
            <h5 className='pt-2 mb-4 font-bold text-xl text-default-800'>
              Profil MAN 19 Jakarta
            </h5>
            <p className='text-default-700 line-clamp-2'>
              Madrasah Aliyah (MA) Negeri 19 Jakarta berdiri di tengah-tengah
              komunitas masyarakat agamis.
            </p>
            <Link
              href='https://man19jkt.sch.id/home/sejarah/'
              target='_blank'
              className='mt-auto'
              color='primary'
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

