import {
  ComparisonCriteria,
  ComparisonSubcriteria,
  Criteria,
  Offense,
  Subcriteria,
} from '@prisma/client'

export function createComparisonCriteriaMatrix(
  data: ComparisonCriteria[]
): number[][] {
  const uniqueCriteria = [
    ...new Set(data.flatMap(item => [item.criteriaId1, item.criteriaId2])),
  ]

  const matrixSize = uniqueCriteria.length
  const comparisonMatrix = Array.from({ length: matrixSize }, () =>
    Array(matrixSize).fill(1)
  )

  data.forEach(({ criteriaId1, criteriaId2, valueComparison }) => {
    const index1 = uniqueCriteria.indexOf(criteriaId1)
    const index2 = uniqueCriteria.indexOf(criteriaId2)

    comparisonMatrix[index2][index1] = valueComparison
    comparisonMatrix[index1][index2] = 1 / (valueComparison as number)
  })
  return comparisonMatrix
}

export function createComparisonSubcriteriaMatrix(
  data: ComparisonSubcriteria[]
): number[][] {
  const uniqueSubcriteria = [
    ...new Set(
      data.flatMap(item => [item.subcriteriaId1, item.subcriteriaId2])
    ),
  ]

  const matrixSize = uniqueSubcriteria.length
  const comparisonMatrix = Array.from({ length: matrixSize }, () =>
    Array(matrixSize).fill(1)
  )

  data.forEach(({ subcriteriaId1, subcriteriaId2, valueComparison }) => {
    const index1 = uniqueSubcriteria.indexOf(subcriteriaId1)
    const index2 = uniqueSubcriteria.indexOf(subcriteriaId2)

    comparisonMatrix[index2][index1] = valueComparison
    comparisonMatrix[index1][index2] = 1 / (valueComparison as number)
  })
  return comparisonMatrix
}

export function calculateEigenValues(matrix: number[][]): number[] {
  const length = matrix.length

  return Array.from({ length }, (_, i) =>
    matrix.reduce((acc, row) => acc + row[i], 0)
  )
}

export function calculateNormalizedValues(
  matrix: number[][],
  eigenValues: number[]
): number[][] {
  return matrix.map((row, i) => row.map((value, j) => value / eigenValues[j]))
}

export function calculateWeight(normalizedValues: number[][]): number[] {
  const length = normalizedValues.length
  return normalizedValues.map(row =>
    Number(row.reduce((acc, value) => acc + value / length, 0).toFixed(4))
  )
}

export function calculateConsistencyIndex(
  weights: number[],
  eigenValues: number[]
): number {
  const length = weights.length
  const lambdaMax = weights.reduce(
    (sum, weight, i) => sum + weight * eigenValues[i],
    0
  )
  return (lambdaMax - length) / (length - 1)
}

export function ratioIndex(length: number): number {
  const rationIndexValues: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0.58,
    4: 0.9,
    5: 1.12,
    6: 1.24,
    7: 1.32,
    8: 1.41,
    9: 1.46,
    10: 1.49,
    11: 1.51,
    12: 1.48,
    13: 1.56,
    14: 1.57,
  }
  return rationIndexValues[length] || 1.59
}

export function calculateConsistencyRatio(
  consistencyIndex: number,
  length: number
): number {
  return consistencyIndex / ratioIndex(length)
}