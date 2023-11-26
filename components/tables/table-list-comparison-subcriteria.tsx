'use client'
import { comparisons } from '@/constants/data'
import {
  RadioGroup,
  Select,
  SelectItem,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import {
  ComparisonSubcriteria,
  Criteria,
  Prisma,
  Subcriteria,
} from '@prisma/client'
import { usePathname } from 'next/navigation'
import React from 'react'
import dynamic from 'next/dynamic'
import { columnComparisonSubcriteria } from '@/constants/columns'

const RadioComparison = dynamic(
  () => import('@/components/radio/radio-comparison')
)
const TableConsistencySubcriteria = dynamic(
  () => import('@/components/tables/table-consistency-subcriteria')
)

type Props = {
  comparisonSubcriterias: ({
    subcriteria1: {
      criteria: Criteria
    } & Subcriteria
    subcriteria2: {
      criteria: Criteria
    } & Subcriteria
  } & ComparisonSubcriteria)[]
  criterias: Criteria[]
}

export default function TableListComparisonSubcriteria({
  comparisonSubcriterias,
  criterias,
}: Props) {
  const pathname = usePathname()
  const [selectionKeys, setSelectionKeys] = React.useState<Selection>(new Set())

  const criteriaSelected = React.useMemo(() => {
    let selected: Criteria[] = []
    if (Array.from(selectionKeys).length > 0) {
      selected = [...criterias]
      selected = selected.filter(item =>
        Array.from(selectionKeys).includes(item.id)
      )
    }
    return selected
  }, [criterias, selectionKeys])

  const comparisonSubcriteriasFiltered = React.useMemo(() => {
    let filteredComparisonSubcriterias = [...comparisonSubcriterias]

    if (Array.from(selectionKeys).length > 0) {
      filteredComparisonSubcriterias = filteredComparisonSubcriterias.filter(
        comparisonSubcriteria =>
          comparisonSubcriteria.subcriteria1.criteria.id ===
          criteriaSelected[0]?.id
      )
    } else {
      filteredComparisonSubcriterias = []
    }

    return filteredComparisonSubcriterias
  }, [comparisonSubcriterias, criteriaSelected, selectionKeys])

  const renderCell = React.useCallback(
    (
      comparisonSubcriteria: {
        subcriteria1: {
          criteria: Criteria
        } & Subcriteria
        subcriteria2: {
          criteria: Criteria
        } & Subcriteria
      } & ComparisonSubcriteria,
      columnKey: React.Key
    ) => {
      const handleUpdateComparisonSubcriteria = async (
        id: string,
        criteriaId: string,
        comparisonSubcriteria: Prisma.ComparisonSubcriteriaUncheckedUpdateInput
      ) => {
        const { updateComparisonSubcriteriaById } = await import(
          '@/lib/actions/comparison-subcriteria.action'
        )
        await updateComparisonSubcriteriaById(
          id,
          criteriaId,
          comparisonSubcriteria,
          pathname
        )
      }

      switch (columnKey) {
        case 'subcriteria1':
          return (
            <p className='text-sm font-normal capitalize'>
              {comparisonSubcriteria.subcriteria1.name}
            </p>
          )
        case 'valueComparison':
          return (
            <RadioGroup
              orientation='horizontal'
              classNames={{
                wrapper: 'flex items-center justify-center flex-nowrap',
              }}
              defaultValue={(
                comparisonSubcriteria.valueComparison as number
              ).toString()}
              onValueChange={value => {
                handleUpdateComparisonSubcriteria(
                  comparisonSubcriteria.id,
                  criteriaSelected[0].id,
                  {
                    valueComparison: Number(value),
                  }
                )
              }}
            >
              {comparisons.map((item, index) => (
                <RadioComparison key={index} value={item.value.toString()}>
                  {item.name}
                </RadioComparison>
              ))}
            </RadioGroup>
          )
        case 'subcriteria2':
          return (
            <p className='text-sm font-normal capitalize'>
              {comparisonSubcriteria.subcriteria2.name}
            </p>
          )
      }
    },
    [criteriaSelected, pathname]
  )

  const topContent = React.useMemo(() => {
    return (
      <div className='flex flex-col sm:gap-8 gap-3 w-full sm:max-w-sm sm:pb-4'>
        <Select
          size='sm'
          aria-label='Pilih kriteria'
          selectionMode='single'
          radius='md'
          disallowEmptySelection
          placeholder='Pilih kriteria'
          selectedKeys={selectionKeys}
          onSelectionChange={setSelectionKeys}
        >
          {criterias.map(criteria => (
            <SelectItem key={criteria.id} value={criteria.id}>
              {criteria.name}
            </SelectItem>
          ))}
        </Select>
        <h4 className='flex flex-row text-base sm:text-xl font-semibold leading-tight text-default-800'>
          Dari kriteria:
          <p className='uppercase ml-3'>{criteriaSelected[0]?.name}</p>
        </h4>
      </div>
    )
  }, [criteriaSelected, criterias, selectionKeys])

  const bottomContent = React.useMemo(() => {
    if (comparisonSubcriteriasFiltered.length > 0) {
      return (
        <TableConsistencySubcriteria
          comparisonSubcriterias={comparisonSubcriteriasFiltered}
        />
      )
    } else {
      return null
    }
  }, [comparisonSubcriteriasFiltered])

  return (
    <Table
      aria-label='Table komparasi subkriteria'
      isHeaderSticky
      classNames={{
        wrapper: 'max-h-[450px] rounded-xl shadow-soft-xl',
      }}
      isStriped
      className=' h-auto min-w-full w-full py-4'
      shadow='none'
      topContent={topContent}
      topContentPlacement='outside'
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
    >
      <TableHeader columns={columnComparisonSubcriteria}>
        {column => (
          <TableColumn
            key={column.uid}
            className={`${
              column.uid === 'valueComparison' ? 'text-center' : ''
            }`}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={'Data komparasi subkriteria tidak ditemukan'}
        items={comparisonSubcriteriasFiltered}
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

