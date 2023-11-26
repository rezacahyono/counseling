'use client'
import { classColorMap, poinColorMap } from '@/constants/color'
import { classOptions, columnRecomendation } from '@/constants/columns'
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
import { ActionSchool, Recomendation, Student } from '@prisma/client'
import classNames from 'classnames'
import React from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import { FaEye } from 'react-icons/fa'
import { IoChevronDown } from 'react-icons/io5'

type Props = {
  recomendations: ({
    student: Student
    actionSchool: ActionSchool
  } & Recomendation)[]
}

export default function TableListRecomendation({ recomendations }: Props) {
  const [filterValue, setFilterValue] = React.useState('')
  const [classFilter, setClassFilter] = React.useState<Selection>('all')
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [page, setPage] = React.useState(1)

  const hasSearchFilter = Boolean(filterValue)

  const filteredItems = React.useMemo(() => {
    let filteredRecomendations = [...recomendations]

    if (hasSearchFilter) {
      filteredRecomendations = filteredRecomendations.filter(
        recomendation =>
          recomendation.student.name
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          recomendation.student.nis
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      )
    }
    if (
      classFilter !== 'all' &&
      Array.from(classFilter).length !== classOptions.length
    ) {
      filteredRecomendations = filteredRecomendations.filter(recomendation =>
        Array.from(classFilter).includes(
          recomendation.student.class.toLowerCase()
        )
      )
    }
    return filteredRecomendations
  }, [classFilter, filterValue, hasSearchFilter, recomendations])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

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
        case 'action':
          return (
            <div className='flex w-screen max-w-xs'>
              <p className='text-sm font-normal capitalize'>
                {recomendation.actionSchool.action}
              </p>
            </div>
          )
        case 'sanction':
          return (
            <div className='flex w-screen max-w-xs'>
              <p className='text-sm font-normal capitalize'>
                {recomendation.actionSchool.sanction}
              </p>
            </div>
          )
        case 'actions':
          return (
            <div className='flex flex-row box-border justify-evenly gap-2'>
              <Tooltip content='Detail rekomendasi'>
                <span className='text-lg text-default-500 hover:text-default-400 cursor-pointer active:opacity-50'>
                  <Link href={`/rekomendasi/${recomendation.id}`}>
                    <FaEye />
                  </Link>
                </span>
              </Tooltip>
            </div>
          )
      }
    },
    []
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
              placeholder='Cari rekomendasi'
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
              startContent={<BiSearchAlt className='text-default-400' />}
              radius='lg'
              variant='faded'
            />
          </div>
          <div className='flex flex-row flex-wrap box-border gap-3'>
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
              Total {recomendations.length} rekomendasi
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
    onClear,
    onRowsPerPageChange,
    onSearchChange,
    recomendations.length,
  ])

  const bottomContent = React.useMemo(() => {
    return (
      <div className='py-2 px-2 flex justify-center sm:justify-between items-center'>
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
            variant='flat'
            onPress={onPreviousPage}
          >
            Sebelumnya
          </Button>
          <Button
            isDisabled={pages <= 1}
            size='sm'
            variant='flat'
            onPress={onNextPage}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    )
  }, [onNextPage, onPreviousPage, page, pages])

  return (
    <Table
      aria-label='Table rekomendasi'
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
    >
      <TableHeader columns={columnRecomendation}>
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
      <TableBody
        emptyContent={'Data rekomendasi tidak ditemukan'}
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

