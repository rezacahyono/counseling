'use client'
import {
  calculateEigenValues,
  createComparisonCriteriaMatrix,
} from '@/lib/ahp/analytic-hierarchy-process'
import { Button } from '@nextui-org/react'
import { ComparisonCriteria, Criteria } from '@prisma/client'
import classNames from 'classnames'
import React from 'react'

type Props = {
  comparisonCriterias: ({
    criteria1: Criteria
    criteria2: Criteria
  } & ComparisonCriteria)[]
}
const TableConsistencyCriteria = ({ comparisonCriterias }: Props) => {
  const [collapse, setCollapse] = React.useState(false)

  const handleCollapse = () => {
    setCollapse(!collapse)
  }

  const uniqueCriteria = React.useMemo(() => {
    return [
      ...new Set(
        comparisonCriterias.flatMap(item => [
          item.criteria1.name,
          item.criteria2.name,
        ])
      ),
    ]
  }, [comparisonCriterias])

  const valueComparisonMatrix = React.useMemo(() => {
    return createComparisonCriteriaMatrix(comparisonCriterias)
  }, [comparisonCriterias])

  const valueComparisonEigen = React.useMemo(() => {
    return calculateEigenValues(valueComparisonMatrix)
  }, [valueComparisonMatrix])

  return (
    <>
      <div className='pt-4 pb-6 flex justify-start lg:justify-center'>
        <Button color='primary' variant='shadow' onClick={handleCollapse}>
          Cek Konsistensi
        </Button>
      </div>
      <div
        className={classNames({
          'flex flex-col gap-6': true,
          hidden: !collapse,
        })}
      >
        <div className='relative overflow-x-auto shadow-soft-xl rounded-xl bg-content1'>
          <table className='w-full'>
            <caption className='py-6 px-6 text-lg font-semibold text-default-800 text-start'>
              Matriks perbandingan kriteria
              <p className='text-base font-normal text-default-500 mt-2'>
                Hasil perhitungan matriks perbandingan penjumlahan kolom,
              </p>
            </caption>
            <thead>
              <tr>
                <th></th>
                {uniqueCriteria.map((item, index) => (
                  <th
                    key={index}
                    scope='col'
                    className='px-6 py-2 text-base font-semibold text-default-800 uppercase'
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uniqueCriteria.map((item, cIndex) => (
                <tr key={cIndex} className='border-t border-default-200'>
                  <th
                    scope='row'
                    className='px-6 py-4 text-base font-semibold text-default-800 uppercase'
                  >
                    {item}
                  </th>
                  {valueComparisonMatrix[cIndex].map(
                    (item: number, index: number) => (
                      <td
                        key={index}
                        className='p-2 text-center text-default-500'
                      >
                        {Number(item.toFixed(4))}
                      </td>
                    )
                  )}
                </tr>
              ))}
              <tr className='border-t border-default-200'>
                <th
                  scope='row'
                  className='px-6 py-4 text-base font-semibold text-default-800 uppercase'
                >
                  Total
                </th>
                {valueComparisonEigen.map((item, index) => (
                  <td
                    key={index}
                    className='p-2 text-center text-base font-semibold text-default-800'
                  >
                    {Number(item.toFixed(4))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default TableConsistencyCriteria

