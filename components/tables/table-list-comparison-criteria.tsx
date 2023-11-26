'use client'

import { columnComparisonCriteria } from '@/constants/columns'
import { comparisons } from '@/constants/data'
import {
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import { ComparisonCriteria, Criteria, Prisma } from '@prisma/client'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import React from 'react'

const RadioComparison = dynamic(
  () => import('@/components/radio/radio-comparison')
)
const TableConsistencyCriteria = dynamic(
  () => import('@/components/tables/table-consistency-criteria')
)

type Props = {
  comparisonCriterias: ({
    criteria1: Criteria
    criteria2: Criteria
  } & ComparisonCriteria)[]
}
export default function TableListComparisonCriteria({
  comparisonCriterias,
}: Props) {
  const pathname = usePathname()

  const renderCell = React.useCallback(
    (
      comparisonCriteria: {
        criteria1: Criteria
        criteria2: Criteria
      } & ComparisonCriteria,
      columnKey: React.Key
    ) => {
      const handleUpdateComparisonCriteria = async (
        id: string,
        comparisonCriteria: Prisma.ComparisonCriteriaUncheckedUpdateInput
      ) => {
        const { updateComparisonCriteriaById } = await import(
          '@/lib/actions/comparison-criteria.action'
        )
        await updateComparisonCriteriaById(id, comparisonCriteria, pathname)
      }

      switch (columnKey) {
        case 'criteria1':
          return (
            <p className='text-sm font-normal capitalize'>
              {comparisonCriteria.criteria1.name}
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
                comparisonCriteria.valueComparison as number
              ).toString()}
              onValueChange={value => {
                handleUpdateComparisonCriteria(comparisonCriteria.id, {
                  valueComparison: Number(value),
                })
              }}
            >
              {comparisons.map((item, index) => (
                <RadioComparison key={index} value={item.value.toString()}>
                  {item.name}
                </RadioComparison>
              ))}
            </RadioGroup>
          )
        case 'criteria2':
          return (
            <p className='text-sm font-normal capitalize'>
              {comparisonCriteria.criteria2.name}
            </p>
          )
      }
    },
    [pathname]
  )

  const bottomContent = React.useMemo(() => {
    return (
      <TableConsistencyCriteria comparisonCriterias={comparisonCriterias} />
    )
  }, [comparisonCriterias])

  return (
    <Table
      aria-label='Table komparasi kriteria'
      isHeaderSticky
      classNames={{
        wrapper: 'max-h-[450px] rounded-xl shadow-soft-xl',
      }}
      isStriped
      className=' h-auto min-w-full w-full py-4'
      shadow='none'
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
    >
      <TableHeader columns={columnComparisonCriteria}>
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
        emptyContent={'Data komparasi kriteria tidak ditemukan'}
        items={comparisonCriterias}
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

