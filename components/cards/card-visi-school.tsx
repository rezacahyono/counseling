import { Image, Link } from '@nextui-org/react'
import React from 'react'

export default function CardVisiSchool() {
  return (
    <div className='px-3 w-full mb-6 lg:mb-0 lg:w-8/12'>
      <div className='shadow-soft-xl h-full rounded-xl bg-content1 p-4'>
        <div className='flex flex-wrap h-full'>
          <div className='max-w-full px-3 lg:w-1/2'>
            <div className='flex flex-col h-full py-2'>
              <h5 className='font-bold text-xl text-default-800 pb-4'>
                MAN 19 Jakarta
              </h5>
              <p className='mb-6'>
                Terwujudnya madrasah sebagai wadah pembentukan insan mandiri
                untuk masa depan Bangsa, Negara dan Agama...
              </p>
              <Link
                href='https://man19jkt.sch.id/home/visi-dan-misi/'
                target='_blank'
                className='mt-auto'
              >
                Read More
              </Link>
            </div>
          </div>
          <div className='max-w-full mt-4 ml-auto text-center lg:mt-0 lg:w-4/12 lg:flex-none'>
            <div className='h-full bg-gradient-to-tl from-primary to-secondary rounded-xl'>
              <div className='relative flex items-center justify-center h-full'>
                <Image
                  className='relative z-20 w-full pt-6'
                  src='/img/rocket-white.webp'
                  alt='rocket'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

