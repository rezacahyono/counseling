'use client'
import { classColorMap, poinColorMap } from '@/constants/color'
import { columnHighestOffense } from '@/constants/columns'
import {
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react'
import { ActionSchool, Recomendation, Student } from '@prisma/client'
import classNames from 'classnames'
import React from 'react'
import { FaEye, FaWhatsapp } from 'react-icons/fa'

type Props = {
  recomendations: ({
    student: Student
    actionSchool: ActionSchool
  } & Recomendation)[]
}
export default function TableHighestOffense({ recomendations }: Props) {
  const renderCell = React.useCallback(
    (
      recomendation: {
        student: Student
        actionSchool: ActionSchool
      } & Recomendation,
      columnKey: React.Key
    ) => {
      switch (columnKey) {
        case 'nis':
          return (
            <p className='font-medium text-sm capitalize'>
              {recomendation.student.nis}
            </p>
          )
        case 'name':
          return (
            <div className='flex w-screen max-w-[200px]'>
              <p className='font-medium text-sm capitalize'>
                {recomendation.student.name}
              </p>
            </div>
          )
        case 'class':
          return (
            <Chip
              className='capitalize px-4'
              color={classColorMap[recomendation.student.class]}
              variant='flat'
            >
              {recomendation.student.class}
            </Chip>
          )
        case 'totalPoin':
          return (
            <Chip
              className='capitalize px-4'
              color={poinColorMap(recomendation.totalPoin)}
              variant='flat'
            >
              {Number(recomendation.totalPoin.toFixed(4))}
            </Chip>
          )
        case 'actions':
          return (
            <div className='flex flex-row box-border justify-evenly gap-2'>
              <Tooltip content='Detail rekomendasi'>
                <span className='text-lg text-default-500 hover:text-default-400 cursor-pointer active:opacity-50'>
                  <Link
                    href={`/rekomendasi/${recomendation.id}`}
                    color='secondary'
                  >
                    <FaEye />
                  </Link>
                </span>
              </Tooltip>
              <Tooltip content='Whatsapp' color='primary'>
                <span className='text-lg text-default-500 hover:text-default-400 cursor-pointer active:opacity-50'>
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
                    <FaWhatsapp />
                  </Link>
                </span>
              </Tooltip>
            </div>
          )
      }
    },
    []
  )

  return (
    <div className='w-full max-w-full px-3 mt-0 mb-6 md:mb-0 md:1/2 md:flex-none lg:w-2/3 lg:flex-none'>
      <Table
        aria-label='Table rekomendasi poin tinggi'
        classNames={{
          wrapper: 'max-h-80 rounded-xl shadow-soft-xl',
        }}
        isHeaderSticky
        shadow='none'
      >
        <TableHeader columns={columnHighestOffense}>
          {column => (
            <TableColumn
              key={column.uid}
              className={classNames({
                'text-center': column.uid === 'actions',
              })}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={recomendations}>
          {item => (
            <TableRow key={item.id}>
              {columnKey => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

