'use client'

import { columnCriteria } from '@/constants/columns'
import {
  Button,
  Input,
  Selection,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Link,
} from '@nextui-org/react'
import { Criteria } from '@prisma/client'
import React from 'react'
import { BiSearchAlt, BiSolidCalculator } from 'react-icons/bi'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

const ButtonDelete = dynamic(() => import('../button/button-delete'))
const CriteriaForm = dynamic(() => import('../forms/criteria-form'))

type Props = {
  criterias: Criteria[]
}

const TableListCriteria = ({ criterias }: Props) => {
  const [filterValue, setFilterValue] = React.useState('')
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [page, setPage] = React.useState(1)
  const [selectionKeys, setSelectionKeys] = React.useState<Selection>(new Set())
  const pathname = usePathname()

  const hasSearchFilter = Boolean(filterValue)

  const criteriaSelected = React.useMemo(() => {
    let selected = [...criterias].map(item => item.id)
    if (
      selectionKeys.toString() !== 'all' &&
      Array.from(selectionKeys).length > 0
    ) {
      selected = selected.filter(item =>
        Array.from(selectionKeys).includes(item)
      )
    }
    return selected
  }, [criterias, selectionKeys])

  const filteredItems = React.useMemo(() => {
    let filteredCriterias = [...criterias]
    if (hasSearchFilter) {
      filteredCriterias = filteredCriterias.filter(criteria =>
        criteria.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    return filteredCriterias
  }, [criterias, filterValue, hasSearchFilter])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const renderCell = React.useCallback(
    (criteria: Criteria, columnKey: React.Key) => {
      const cellValue = criteria[columnKey as keyof {}]

      switch (columnKey) {
        case 'name':
          return (
            <p className='font-medium text-base  capitalize'>{cellValue}</p>
          )
        case 'valuePriority':
          return <p className='text-base font-normal capitalize'>{cellValue}</p>
        case 'actions':
          return (
            <div className='flex box-border justify-evenly gap-2'>
              <CriteriaForm criteria={criteria} />
              <ButtonDelete
                id={criteria.id}
                path={pathname}
                message='kriteria'
                model='criteria'
                action={() => setSelectionKeys(new Set([]))}
              />
            </div>
          )
        default:
          return cellValue
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
              placeholder='Cari kriteria'
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
              startContent={<BiSearchAlt className='text-default-400' />}
              radius='lg'
              variant='faded'
            />
          </div>
          <div className='flex flex-row flex-wrap box-border gap-3'>
            <CriteriaForm />
            <Button
            as={Link}
              color='primary'
              endContent={<BiSolidCalculator />}
              variant='ghost'
              isDisabled={criterias.length < 3}
              href='/kriteria/perbandingan'
            >
              Hitung Nilai Prioritas
            </Button>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex gap-1 lg:gap-4 flex-col lg:flex-row'>
            <span className='text-default-400 text-small'>
              Total {criterias.length} kriteria
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
    criterias.length,
    filterValue,
    filteredItems.length,
    onClear,
    onRowsPerPageChange,
    onSearchChange,
    selectionKeys,
  ])

  const bottomContent = React.useMemo(() => {
    return (
      <div className='py-2 px-2 flex flex-col gap-4'>
        {(selectionKeys.toString() === 'all' ||
          Array.from(selectionKeys).length > 1) && (
          <div className='flex items-end justify-end'>
            <ButtonDelete
              ids={criteriaSelected}
              path={pathname}
              message='kriteria'
              model='criteria'
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
    criteriaSelected,
    onNextPage,
    onPreviousPage,
    page,
    pages,
    pathname,
    selectionKeys,
  ])

  return (
    <Table
      aria-label='Table kriteria'
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
      <TableHeader columns={columnCriteria}>
        {column => (
          <TableColumn
            key={column.uid}
            className={`${column.uid === 'actions' ? 'text-center' : ''}`}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'Data kriteria tidak ditemukan'} items={items}>
        {item => (
          <TableRow key={item.id}>
            {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default TableListCriteria

