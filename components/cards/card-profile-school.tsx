import React from 'react'
import { Card, CardBody, Link } from '@nextui-org/react'

export default function CardProfileSchool() {
  return (
    <div className='px-3 w-full lg:w-4/12'>
      <Card className='shadow-soft-xl h-full'>
        <CardBody>
          <div className='relative h-full overflow-hidden rounded-xl'>
            <video src='/video/profile-man-19.mp4' autoPlay loop muted />
            <div className='absolute top-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-zinc-600 to-slate-800 opacity-70'>
              <div className='relative z-10 flex flex-col flex-auto h-full p-4'>
                <h5 className='pt-2 mb-4 font-bold text-xl text-zinc-50'>
                  Profil MAN 19 Jakarta
                </h5>
                <p className='text-zinc-50 line-clamp-2'>
                  Madrasah Aliyah (MA) Negeri 19 Jakarta berdiri di
                  tengah-tengah komunitas masyarakat agamis.
                </p>
                <Link
                  href='https://man19jkt.sch.id/home/sejarah/'
                  target='_blank'
                  className='mt-auto text-zinc-50'
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

