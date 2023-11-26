'use client'
import { consistencyColorMap } from '@/constants/color'
import {
  calculateConsistencyIndex,
  calculateConsistencyRatio,
  calculateEigenValues,
  calculateNormalizedValues,
  calculateWeight,
  createComparisonCriteriaMatrix,
  ratioIndex,
} from '@/lib/ahp/analytic-hierarchy-process'
import { isConsistencyRatioIndex } from '@/utils/util'
import { Button, Chip } from '@nextui-org/react'
import { ComparisonCriteria, Criteria } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
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

  const valueComparisonNormalized = React.useMemo(() => {
    return calculateNormalizedValues(
      valueComparisonMatrix,
      valueComparisonEigen
    )
  }, [valueComparisonEigen, valueComparisonMatrix])

  const valueComparisonEigenNormalized = React.useMemo(() => {
    return calculateEigenValues(valueComparisonNormalized)
  }, [valueComparisonNormalized])

  const valueComparisonWeights = React.useMemo(() => {
    return calculateWeight(valueComparisonNormalized)
  }, [valueComparisonNormalized])

  const valueConsistencyIndex = React.useMemo(() => {
    return calculateConsistencyIndex(
      valueComparisonWeights,
      valueComparisonEigen
    )
  }, [valueComparisonEigen, valueComparisonWeights])

  const valueRatioIndex = ratioIndex(valueComparisonWeights.length)

  const valueConsistencyRatio = React.useMemo(() => {
    return calculateConsistencyRatio(
      valueConsistencyIndex,
      valueComparisonWeights.length
    )
  }, [valueComparisonWeights.length, valueConsistencyIndex])

  return (
    <>
      <div className='pt-4 pb-6 flex justify-start lg:justify-center'>
        <Button color='primary' variant='shadow' onClick={handleCollapse}>
          Cek Konsistensi
        </Button>
      </div>
      <AnimatePresence initial={false}>
        {collapse && (
          <motion.section
            className='flex flex-col gap-8'
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <motion.div
              variants={{ collapsed: { scale: 0.8 }, open: { scale: 1 } }}
              transition={{ duration: 0.8 }}
              className='relative overflow-x-auto shadow-soft-xl rounded-xl bg-content1 no-scrollbar'
            >
              <table className='w-full'>
                <caption className='py-6 px-6 text-lg font-semibold text-default-800 text-start'>
                  Matriks perbandingan kriteria
                  <p className='text-base font-normal text-default-500 mt-2'>
                    Hasil perhitungan matriks perbandingan penjumlahan kolom.
                  </p>
                </caption>
                <thead className='text-base font-medium text-default-800 uppercase text-center'>
                  <tr>
                    <td></td>
                    {uniqueCriteria.map((item, index) => (
                      <td key={index} scope='col' className='px-6 py-2 '>
                        {item}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uniqueCriteria.map((item, cIndex) => (
                    <tr
                      key={cIndex}
                      className='border-t border-default-200 rounded-xl'
                    >
                      <td
                        scope='row'
                        className='text-base font-medium text-default-800 uppercase text-center'
                      >
                        {item}
                      </td>
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
                    <td
                      scope='row'
                      className='text-base font-medium text-default-800 uppercase text-center'
                    >
                      Total
                    </td>
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
            </motion.div>

            <motion.div
              variants={{ collapsed: { scale: 0.8 }, open: { scale: 1 } }}
              transition={{ duration: 0.8 }}
              className='relative overflow-x-auto shadow-soft-xl rounded-xl bg-content1 no-scrollbar'
            >
              <table className='w-full'>
                <caption className='py-6 px-6 text-lg font-semibold text-default-800 text-start'>
                  Matriks Kriteria (Normalisasi)
                  <p className='text-base font-normal text-default-500 mt-2'>
                    Hasil perhitungan matriks normalisasi.
                  </p>
                </caption>
                <thead className='text-base font-medium text-default-800 uppercase text-center'>
                  <tr>
                    <td></td>
                    {uniqueCriteria.map((item, index) => (
                      <td key={index} scope='col' className='px-6 py-2 '>
                        {item}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uniqueCriteria.map((item, cIndex) => (
                    <tr
                      key={cIndex}
                      className='border-t border-default-200 rounded-xl'
                    >
                      <td
                        scope='row'
                        className='text-base font-medium text-default-800 uppercase text-center'
                      >
                        {item}
                      </td>
                      {valueComparisonNormalized[cIndex].map(
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
                    <td
                      scope='row'
                      className='text-base font-medium text-default-800 uppercase text-center'
                    >
                      Total
                    </td>
                    {valueComparisonEigenNormalized.map((item, index) => (
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
            </motion.div>

            <motion.div
              variants={{ collapsed: { scale: 0.8 }, open: { scale: 1 } }}
              transition={{ duration: 0.8 }}
              className='relative overflow-x-auto shadow-soft-xl rounded-xl bg-content1 no-scrollbar'
            >
              <table className='w-full'>
                <caption className='py-6 px-6 text-lg font-semibold text-default-800 text-start'>
                  Rasio Konsistensi
                  <p className='text-base font-normal text-default-500 mt-2'>
                    Hasil perhitungan rasio konsistensi matriks dan bobot
                    prioritas kriteria.
                  </p>
                </caption>
                <thead className='text-base font-medium text-default-800 uppercase text-center'>
                  <tr>
                    <td scope='col' className='px-6 py-2 '>
                      Kriteria
                    </td>
                    <td scope='col' className='px-6 py-2 '>
                      Prioritas
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {uniqueCriteria.map((item, index) => (
                    <tr
                      key={index}
                      className='border-t border-default-200 rounded-xl'
                    >
                      <td
                        scope='row'
                        className='p-2 text-base font-medium text-default-800 uppercase text-center'
                      >
                        {item}
                      </td>

                      <td className='p-2 text-center text-default-500'>
                        {Number(valueComparisonWeights[index].toFixed(4))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            <motion.div
              variants={{ collapsed: { scale: 0.8 }, open: { scale: 1 } }}
              transition={{ duration: 0.8 }}
              className='shadow-soft-xl rounded-xl p-4 bg-content1'
            >
              <dl className='divide-y divide-default-300'>
                <div className='py-2 sm:py-4 sm:grid-cols-5 sm:gap-4'>
                  <dt className='text-base font-medium leading-6 text-default-800'>
                    Consistency Index (CI)
                  </dt>
                  <dd className='text-sm font-normal leading-6 text-default-700 sm:col-span-4'>
                    {Number(valueConsistencyIndex.toFixed(4))}
                  </dd>
                </div>
                <div className='py-2 sm:py-4 sm:grid-cols-5 sm:gap-4'>
                  <dt className='text-base font-medium leading-6 text-default-800'>
                    Ratio Index (RI)
                  </dt>
                  <dd className='text-sm font-normal leading-6 text-default-700 sm:col-span-4'>
                    {Number(valueRatioIndex.toFixed(4))}
                  </dd>
                </div>
                <div className='py-2 sm:py-4 sm:grid-cols-5 sm:gap-4'>
                  <dt className='text-base font-medium leading-6 text-default-800'>
                    Consistency Ratio (CR)
                  </dt>
                  <dd className='text-sm leading-6 text-default-700 sm:col-span-4'>
                    {Number(valueConsistencyRatio.toFixed(4))}
                    <Chip
                      className='ml-5'
                      variant='light'
                      color={consistencyColorMap(
                        Number(valueConsistencyRatio.toFixed(4))
                      )}
                    >
                      {isConsistencyRatioIndex(
                        Number(valueConsistencyRatio.toFixed(4))
                      )}
                    </Chip>
                  </dd>
                </div>
              </dl>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}

export default TableConsistencyCriteria

