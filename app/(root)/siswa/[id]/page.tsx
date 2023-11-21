import { classColorMap } from '@/constants/color'
import { Card, CardBody, Chip, Link } from '@nextui-org/react'
import dynamic from 'next/dynamic'
import React from 'react'
import { BiSolidPhoneCall } from 'react-icons/bi'

const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)

const DetailStudentPage = async ({ params }: { params: { id: string } }) => {
  const fecthStudentById = (await import('@/lib/actions/student.action'))
    .fetchStudentById
  const student = await fecthStudentById(params.id)

  return (
    <div className='w-full px-6 py-6 mx-auto'>
      <div className='pb-4'>
        <Breadcrumbs nameStudent={student?.name} />
      </div>
      <h3 className='text-2xl font-bold leading-tight text-default-800 py-2'>
        Detail data siswa
      </h3>
      <p className='text-base leading-6 text-default-500'>
        informasi detail terkait data siswa
      </p>
      <Card className='shadow-soft-xl h-full my-6 px-2 lg:px-6'>
        <CardBody>
          <dl className='divide-y divide-default-300'>
            <div className='py-3 sm:py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-base font-normal leading-6 text-default-800'>
                Nama Lengkap
              </dt>
              <dd className='mt-1 text-medium font-medium leading-6 text-default-700 sm:col-span-2 sm:mt-0 capitalize'>
                {student?.name}
              </dd>
            </div>
            <div className='py-3 sm:py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-base font-normal leading-6 text-default-800'>
                NIS
              </dt>
              <dd className='mt-1 text-medium font-medium leading-6 text-default-700 sm:col-span-2 sm:mt-0 capitalize'>
                {student?.nis}
              </dd>
            </div>
            <div className='py-3 sm:py-6 grid sm:grid-cols-3 gap-3 sm:px-0'>
              <dt className='text-base font-normal leading-6 text-default-800'>
                Kelas
              </dt>
              <Chip
                className='capitalize px-4 py-2'
                color={classColorMap[student?.class as string]}
                size='md'
                variant='flat'
              >
                {student?.class}
              </Chip>
            </div>
            <div className='py-3 sm:py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-base font-normal leading-6 text-default-800'>
                Jenis Kelamin
              </dt>
              <dd className='mt-1 text-medium font-medium leading-6 text-default-700 sm:col-span-2 sm:mt-0 capitalize'>
                {student?.gender}
              </dd>
            </div>
            <div className='py-3 sm:py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-base font-normal leading-6 text-default-800'>
                Alamat
              </dt>
              <dd className='mt-1 text-medium font-medium leading-6 text-default-700 sm:col-span-2 sm:mt-0 capitalize'>
                {student?.address}
              </dd>
            </div>
            <div className='py-3 sm:py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-base font-normal leading-6 text-default-800'>
                Nama OrangTua/Wali
              </dt>
              <dd className='mt-1 text-medium font-medium leading-6 text-default-700 sm:col-span-2 sm:mt-0 capitalize'>
                {student?.nameParent}
              </dd>
            </div>
            <div className='py-3 sm:py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-base font-normal leading-6 text-default-800'>
                No HP Orang Tua
              </dt>
              <dd className='mt-2 text-sm text-default-800 sm:col-span-2 sm:mt-0'>
                <ul
                  role='list'
                  className='divide-y divide-default-300 rounded-md border border-default-300'
                >
                  <li className='flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6'>
                    <div className='flex w-0 flex-1 items-center'>
                      <BiSolidPhoneCall
                        className='h-5 w-5 flex-shrink-0 text-default-400'
                        aria-hidden='true'
                      />
                      <div className='ml-4 flex min-w-0 flex-1 gap-2'>
                        <span className='truncate text-medium font-medium capitalize'>
                          +62{student?.phoneNumberParent}
                        </span>
                      </div>
                    </div>
                    <div className='ml-4 flex-shrink-0'>
                      <Link
                        href={`https://wa.me/62${student?.phoneNumberParent}?text=Selamat+siang+bapak%2Fibu+*${student?.nameParent}*+%0D%0ASaya+dari+guru+BK+MAN+19+Jakarta.%0D%0ADengan+ini+saya+ingin+membicarakan+mengenai+anak+bapak%2Fibu+yang+bernama+*${student?.name}*`}
                        target='_blank'
                      >
                        WhatsApp
                      </Link>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    </div>
  )
}

export default DetailStudentPage

