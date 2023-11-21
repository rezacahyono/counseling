'use client'

import { classColorMap } from '@/constants/color'
import { classOptions, columnStudent } from '@/constants/columns'
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Pagination,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react'
import { Student } from '@prisma/client'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import React from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import { IoChevronDown } from 'react-icons/io5'
import { FaEye } from "react-icons/fa";

const StudentForm = dynamic(() => import('../forms/student-form'))
const ButtonDelete = dynamic(() => import('../button/button-delete'))

type Props = {
  students: Student[]
}

const TableListStudent = ({ students }: Props) => {
  const [filterValue, setFilterValue] = React.useState('')
  const [classFilter, setClassFilter] = React.useState<Selection>('all')
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [page, setPage] = React.useState(1)
  const [selectionKeys, setSelectionKeys] = React.useState<Selection>(new Set())
  const pathname = usePathname()

  const hasSearchFilter = Boolean(filterValue)

  const studentSelected = React.useMemo(() => {
    let selected = [...students].map(item => item.id)
    if (
      selectionKeys.toString() !== 'all' &&
      Array.from(selectionKeys).length > 0
    ) {
      selected = selected.filter(item =>
        Array.from(selectionKeys).includes(item)
      )
    }
    return selected
  }, [selectionKeys, students])

  const filteredItems = React.useMemo(() => {
    let filteredStudents = [...students]

    if (hasSearchFilter) {
      filteredStudents = filteredStudents.filter(
        student =>
          student.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          student.nis.toLowerCase().includes(filterValue.toLowerCase())
      )
    }

    if (
      classFilter !== 'all' &&
      Array.from(classFilter).length !== classOptions.length
    ) {
      filteredStudents = filteredStudents.filter(siswa =>
        Array.from(classFilter).includes(siswa.class.toLowerCase())
      )
    }
    return filteredStudents
  }, [classFilter, filterValue, hasSearchFilter, students])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const renderCell = React.useCallback(
    (student: Student, columnKey: React.Key) => {
      const cellValue = student[columnKey as keyof {}]

      switch (columnKey) {
        case 'nis':
          return <p className='font-medium text-base capitalize'>{cellValue}</p>
        case 'name':
          return <p className='font-medium text-base capitalize'>{cellValue}</p>
        case 'class':
          return (
            <Chip
              className='uppercase px-4'
              color={classColorMap[cellValue]}
              variant='flat'
            >
              {cellValue}
            </Chip>
          )
        case 'gender':
          return <p className='text-sm font-normal'>{cellValue}</p>
        case 'actions':
          return (
            <div className='flex flex-row box-border justify-evenly gap-2'>
              <Tooltip content='Detail siswa'>
                <span className='text-lg text-default-500 hover:text-default-400 cursor-pointer active:opacity-50'>
                  <Link href={`/siswa/${student.id}`}>
                    <FaEye />
                  </Link>
                </span>
              </Tooltip>
              <StudentForm student={student} />
              <ButtonDelete
                id={student.id}
                path={pathname}
                message='siswa'
                model='student'
                action={() => {}}
              />
            </div>
          )
        default:
          cellValue
      }
    },
    [pathname]
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
              placeholder='Cari siswa'
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
              startContent={<BiSearchAlt className='text-default-400' />}
              radius='lg'
              variant='faded'
            />
          </div>
          <div className='flex flex-row flex-wrap box-border gap-3'>
            <StudentForm />
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<IoChevronDown className='text-small' />}
                  variant='shadow'
                  color='secondary'
                  className='dark:text-zinc-800'
                >
                  Kelas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Kelas menu'
                closeOnSelect={false}
                selectedKeys={classFilter}
                selectionMode='multiple'
                onSelectionChange={setClassFilter}
              >
                {classOptions.map(c => (
                  <DropdownItem key={c.uid} className='capitalize'>
                    {c.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex gap-1 lg:gap-4 flex-col lg:flex-row'>
            <span className='text-default-400 text-small'>
              Total {studentSelected.length} siswa
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
    classFilter,
    filterValue,
    filteredItems.length,
    onClear,
    onRowsPerPageChange,
    onSearchChange,
    selectionKeys,
    studentSelected.length,
  ])

  const bottomContent = React.useMemo(() => {
    return (
      <div className='py-2 px-2 flex flex-col gap-4'>
        {(selectionKeys.toString() === 'all' ||
          Array.from(selectionKeys).length > 1) && (
          <div className='flex items-end justify-end'>
            <ButtonDelete
              ids={studentSelected}
              path={pathname}
              message='siswa'
              model='student'
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
    onNextPage,
    onPreviousPage,
    page,
    pages,
    pathname,
    selectionKeys,
    studentSelected,
  ])

  return (
    <Table
      aria-label='Table siswa'
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
      <TableHeader columns={columnStudent}>
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
      <TableBody emptyContent={'Data siswa tidak ditemukan'} items={items}>
        {item => (
          <TableRow key={item.id}>
            {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default TableListStudent

