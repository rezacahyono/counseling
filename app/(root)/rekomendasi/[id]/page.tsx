import { classColorMap } from '@/constants/color'
import { columnDetailRecomendation } from '@/constants/columns'
import { fetchRecomendationById } from '@/lib/actions/recomendation.action'
import { Chip, Link } from '@nextui-org/react'
import dynamic from 'next/dynamic'
import React from 'react'
import { BiSolidPhoneCall } from 'react-icons/bi'

const PageWrapper = dynamic(() => import('@/components/wrapper/page-wrapper'))
const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)

export default async function DetailRecomendationPage({
  params,
}: {
  params: { id: string }
}) {
  const recomendation = await fetchRecomendationById(params.id, {
    actionSchool: true,
    criteria: true,
    subcriteria: true,
  })

  return (
    <PageWrapper>
      <div className='w-full px-6 py-6 mx-auto'>
        <div className='pb-4'>
          <Breadcrumbs nameStudent={recomendation?.student.name} />
        </div>
        <h3 className='text-2xl font-bold leading-tight text-default-800 py-2'>
          Detail data rekomendasi sanksi siswa
        </h3>
        <p className='text-base leading-6 text-default-600'>
          Informasi detail terkait data rekomendasi sanksi siswa
        </p>
        <div className='flex flex-col sm:gap-10 gap-6 py-6 sm:py-10'>
          <div className='shadow-soft-xl rounded-xl h-full px-4 lg:px-9 py-4 bg-content1'>
            <dl className='divide-y divide-default-300'>
              <div className='py-3 sm:py-6 sm:grid-cols-3 sm:grid'>
                <dt className='text-base font-normal leading-6 text-default-800'>
                  NIS
                </dt>
                <dd className='text-medium font-medium leading-6 text-default-700'>
                  {recomendation?.student.nis}
                </dd>
              </div>
              <div className='py-3 sm:py-6 sm:grid-cols-3 sm:grid'>
                <dt className='text-base font-normal leading-6 text-default-800'>
                  Nama Lengkap
                </dt>
                <dd className='text-medium font-medium leading-6 text-default-700'>
                  {recomendation?.student.name}
                </dd>
              </div>
              <div className='py-3 sm:py-6 sm:grid-cols-3 sm:grid'>
                <dt className='text-base font-normal leading-6 text-default-800'>
                  Kelas
                </dt>
                <Chip
                  className='capitalize px-4 py-2'
                  color={classColorMap[recomendation?.student.class as string]}
                  size='md'
                  variant='flat'
                >
                  {recomendation?.student.class}
                </Chip>
              </div>
              <div className='py-3 sm:py-6 sm:grid-cols-3 sm:grid'>
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
                            +62{recomendation?.student?.phoneNumberParent}
                          </span>
                        </div>
                      </div>
                      <div className='ml-4 flex-shrink-0'>
                        <Link
                          href={`https://api.whatsapp.com/send?phone=${
                            recomendation?.student.phoneNumberParent
                          }&text=Selamat%20siang%20bapak%2Fibu%20*${
                            recomendation?.student.nameParent
                          }*.%0ASaya%20dari%20Guru%20BK%20*MAN%2019%20JAKARTA*.%20Dengan%20ini%20saya%20ingin%20menginformasikan%20bahwa%20anak%20Bapak%2FIbu%20yang%20bernama%20*${
                            recomendation?.student.name
                          }*%20telah%20memiliki%20*Poin%20Pelanggaran%20${Number(
                            (recomendation?.totalPoin ?? 0).toFixed(4)
                          )}*%20dan%20saya%20selaku%20Guru%20BK%20*MAN%2019%20JAKRATA*%20ingin%20membicarakan%20perihal%20anak%20Bapak%2FIbu%20sekalian.%20`}
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
          </div>

          <div className='relative overflow-x-auto shadow-soft-xl rounded-xl bg-content1'>
            <table className='w-full'>
              <caption className='py-6 px-6 text-lg font-semibold text-default-800 text-start'>
                Matriks perbandingan kriteria
                <p className='text-base font-normal text-default-500 mt-2'>
                  Hasil perhitungan matriks perbandingan penjumlahan kolom.
                </p>
              </caption>
              <thead className='text-sm font-medium text-default-600 uppercase'>
                <tr>
                  {columnDetailRecomendation.map(item => (
                    <th key={item.uid} className='px-6 py-2 '>
                      {item.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recomendation?.student.offence.map((item, index) => (
                  <tr
                    key={index}
                    className='border-t border-default-300 text-center text-default-600'
                  >
                    <td className='md:p-4 p-2 border-r border-default-300'>
                      {item.date.toDateString()}
                    </td>
                    <td className='md:p-4 p-2 border-x border-default-300'>
                      {item.criteria.name}
                    </td>
                    <td className='md:p-4 p-2 border-x border-default-300'>
                      {item.subcriteria.name}
                    </td>
                    <td className='md:p-4 p-2 border-x border-default-300'>
                      {item.description}
                    </td>
                    <td className='md:p-4 p-2 border-x border-default-300 whitespace-nowrap'>{`${item.criteria.valuePriority} x ${item.subcriteria.valuePriority}`}</td>
                    <td className='md:p-4 p-2 border-x border-default-300'>
                      {item.criteria.valuePriority &&
                      item.subcriteria.valuePriority
                        ? (
                            item.criteria.valuePriority *
                            item.subcriteria.valuePriority
                          ).toFixed(4)
                        : 0}
                    </td>
                    <td className='md:p-4 p-2 border-l border-default-300'>
                      {item.subcriteria.poin}
                    </td>
                  </tr>
                ))}
                <tr className='border-t border-default-300 text-center text-default-700'>
                  <td
                    className='md:p-4 p-2 text-end whitespace-nowrap border-r border-default-300'
                    colSpan={5}
                  >
                    Total Poin
                  </td>
                  <td
                    className='md:p-4 p-2 text-center whitespace-nowrap'
                    colSpan={2}
                  >
                    {Number(recomendation?.totalPoin.toFixed(4))}
                  </td>
                </tr>
                <tr className='border-t border-default-300 text-center text-default-700'>
                  <td
                    className='md:p-4 p-2 text-end whitespace-nowrap border-r border-default-300'
                    colSpan={5}
                  >
                    Rentang Poin
                  </td>
                  <td
                    className='md:p-4 p-2 text-center whitespace-nowrap'
                    colSpan={2}
                  >
                    {`${recomendation?.actionSchool.poinStart} - ${recomendation?.actionSchool.poinEnd}`}
                  </td>
                </tr>
                <tr className='border-t border-default-300 text-center text-default-700'>
                  <td
                    className='md:p-4 p-2 text-end whitespace-nowrap border-r border-default-300'
                    colSpan={5}
                  >
                    Stack
                  </td>
                  <td
                    className='md:p-4 p-2 text-center whitespace-nowrap'
                    colSpan={2}
                  >
                    {recomendation?.actionSchool.stack}
                  </td>
                </tr>
                <tr className='border-t border-default-300 text-center text-default-700'>
                  <td
                    className='md:p-4 p-2 text-end whitespace-nowrap border-r border-default-300'
                    colSpan={5}
                  >
                    Tindakan Sekolah
                  </td>
                  <td className='md:p-4 p-2 text-justify max-w-sm' colSpan={2}>
                    {recomendation?.actionSchool.action}
                  </td>
                </tr>
                <tr className='border-t border-default-300 text-center text-default-700'>
                  <td
                    className='md:p-4 p-2 text-end whitespace-nowrap border-r border-default-300'
                    colSpan={5}
                  >
                    Sanksi Sekolah
                  </td>
                  <td className='md:p-4 p-2 text-justify max-w-sm' colSpan={2}>
                    {recomendation?.actionSchool.sanction}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

