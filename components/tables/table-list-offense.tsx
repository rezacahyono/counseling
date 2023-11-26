'use client'

import {
  Button,
  Chip,
  Input,
  Pagination,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import { Criteria, Offense, Student, Subcriteria } from '@prisma/client'
import { usePathname } from 'next/navigation'
import React from 'react'
import { poinColorMap } from '@/constants/color'
import { BiSearchAlt } from 'react-icons/bi'
import { columnOffense } from '@/constants/columns'
import dynamic from 'next/dynamic'

const OffenseForm = dynamic(() => import('@/components/forms/offense-form'))
const ButtonDelete = dynamic(() => import('@/components/button/button-delete'))

type Props = {
  offenses: ({
    student: Student
    criteria: Criteria
    subcriteria: Subcriteria
  } & Offense)[]
  students: Student[]
  criterias: ({
    subcriteria: Subcriteria[]
  } & Criteria)[]
}

export default function TableListOffense({
  offenses,
  students,
  criterias,
}: Props) {
  const [filterValue, setFilterValue] = React.useState('')
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [page, setPage] = React.useState(1)
  const [selectionKeys, setSelectionKeys] = React.useState<Selection>(new Set())
  const pathname = usePathname()

  const hasSearchFilter = Boolean(filterValue)

  const offenseSelected = React.useMemo(() => {
    let selected = [...offenses].map(item => item.id)
    if (
      selectionKeys.toString() !== 'all' &&
      Array.from(selectionKeys).length > 0
    ) {
      selected = selected.filter(item =>
        Array.from(selectionKeys).includes(item)
      )
    }
    return selected
  }, [offenses, selectionKeys])

  const filteredItems = React.useMemo(() => {
    let filteredOffenses = [...offenses]
    if (hasSearchFilter) {
      filteredOffenses = filteredOffenses.filter(
        offense =>
          offense.student.name
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          offense.student.nis
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          offense.criteria.name
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          offense.subcriteria.name
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      )
    }
    return filteredOffenses
  }, [filterValue, hasSearchFilter, offenses])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const renderCell = React.useCallback(
    (
      offense: {
        student: Student
        criteria: Criteria
        subcriteria: Subcriteria
      } & Offense,
      columnKey: React.Key
    ) => {
      const cellValue = offense[columnKey as keyof {}]

      switch (columnKey) {
        case 'date':
          return (
            <p className='text-sm font-normal capitalize'>
              {offense.date.toDateString()}
            </p>
          )
        case 'studentName':
          return (
            <div className='flex w-screen max-w-[200px]'>
              <p className='font-medium text-base capitalize'>
                {offense.student.name}
              </p>
            </div>
          )
        case 'criteriaName':
          return (
            <p className='text-sm font-normal capitalize'>
              {offense.criteria.name}
            </p>
          )
        case 'offense':
          return (
            <p className='text-sm font-normal capitalize'>
              {offense.subcriteria.name}
            </p>
          )
        case 'poin':
          return (
            <Chip
              className='capitalize px-4'
              color={poinColorMap(offense.subcriteria.poin)}
              variant='flat'
            >
              {offense.subcriteria.poin}
            </Chip>
          )
        case 'description':
          return (
            <div className='flex w-screen max-w-xs lg:max-w-md'>
              <p className='text-base font-normal capitalize'>{cellValue}</p>
            </div>
          )
        case 'actions':
          return (
            <div className='flex box-border justify-evenly gap-2'>
              <OffenseForm
                offense={offense}
                students={students}
                criterias={criterias}
              />
              <ButtonDelete
                id={offense.id}
                path={pathname}
                message='pelanggaran'
                model='offense'
                action={() => setSelectionKeys(new Set([]))}
              />
            </div>
          )
      }
    },
    [criterias, pathname, students]
  )

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value))
      setPage(1)
    },
    []
  )

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = React.useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  const topContent = React.useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex flex-row box-border gap-6 items-center justify-between flex-wrap mt-4 sm:mt-2'>
          <div className='flex flex-row box-border gap-6 flex-wrap items-center w-full sm:max-w-xs'>
            <Input
              isClearable
              placeholder='Cari pelanggaran'
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
              startContent={<BiSearchAlt className='text-default-400' />}
              radius='lg'
              variant='faded'
            />
          </div>
          <div className='flex flex-row flex-wrap box-border gap-3'>
            <OffenseForm students={students} criterias={criterias} />
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex gap-1 lg:gap-4 flex-col lg:flex-row'>
            <span className='text-default-400 text-small'>
              Total {offenses.length} pelanggaran
            </span>
            <span className='text-small text-default-400'>
              {selectionKeys === 'all'
                ? 'Semua item yang dipilih'
                : `${selectionKeys.size} dari ${filteredItems.length} pilihan`}
            </span>
          </div>
          <label className='flex items-center text-default-400 text-small'>
            Baris per halaman:
            <select
              className='bg-transparent outline-none text-default-400 text-small'
              onChange={onRowsPerPageChange}
            >
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='15'>15</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [
    criterias,
    filterValue,
    filteredItems.length,
    offenses.length,
    onClear,
    onRowsPerPageChange,
    onSearchChange,
    selectionKeys,
    students,
  ])

  const bottomContent = React.useMemo(() => {
    return (
      <div className='py-2 px-2 flex flex-col gap-4'>
        {(selectionKeys.toString() === 'all' ||
          Array.from(selectionKeys).length > 1) && (
          <div className='flex items-end justify-end'>
            <ButtonDelete
              ids={offenseSelected}
              path={pathname}
              message='pelanggaran'
              model='offense'
              action={() => {
                setSelectionKeys(new Set([]))
              }}
            />
          </div>
        )}
        <div className='flex justify-center sm:justify-between items-center'>
          <Pagination
            isCompact
            showControls
            showShadow
            color='primary'
            page={page}
            total={pages}
            onChange={setPage}
          />
          <div className='hidden sm:flex w-[30%] justify-end gap-2'>
            <Button
              isDisabled={pages <= 1}
              size='sm'
              onPress={onPreviousPage}
              variant='shadow'
            >
              Sebelumnya
            </Button>
            <Button
              isDisabled={pages <= 1}
              size='sm'
              onPress={onNextPage}
              variant='shadow'
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    )
  }, [
    offenseSelected,
    onNextPage,
    onPreviousPage,
    page,
    pages,
    pathname,
    selectionKeys,
  ])

  return (
    <Table
      aria-label='Table pelanggaran'
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
      classNames={{
        wrapper: 'max-h-[450px] rounded-xl shadow-soft-xl',
      }}
      isStriped
      topContent={topContent}
      topContentPlacement='outside'
      className=' h-auto min-w-full w-full py-4'
      shadow='none'
      selectionMode='multiple'
      selectedKeys={selectionKeys}
      onSelectionChange={setSelectionKeys}
    >
      <TableHeader columns={columnOffense}>
        {column => (
          <TableColumn
            key={column.uid}
            className={`${column.uid === 'actions' ? 'text-center' : ''}`}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={'Data pelanggaran tidak ditemukan'}
        items={items}
      >
        {item => (
          <TableRow key={item.id}>
            {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

