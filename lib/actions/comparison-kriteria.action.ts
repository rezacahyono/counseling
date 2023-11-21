'use server'

import { Prisma } from '@prisma/client'
import prisma from '../prisma/client'
import { revalidatePath } from 'next/cache'
import { handlePrismaError } from '../prisma/errors'
import {
  calculateEigenValues,
  calculateNormalizedValues,
  calculateWeight,
  createComparisonCriteriaMatrix,
} from '../ahp/analytic-hierarchy-process'

export async function fetchAllComparisonCriteria() {
  return await prisma.comparisonCriteria.findMany({
    orderBy: {
      criteriaId1: 'asc',
    },
    include: {
      criteria1: true,
      criteria2: true,
    },
  })
}

export async function updateComparisonCriteriaById(
  id: string,
  comparisonCriteria: Prisma.ComparisonCriteriaUncheckedUpdateInput,
  path: string
): Promise<void> {
  try {
    await prisma.comparisonCriteria.update({
      where: { id: id },
      data: comparisonCriteria,
    })

    const comparisonCriterias = await prisma.comparisonCriteria
      .findMany()
      .then(value => value.flatMap(compar => (compar ? [compar] : [])))

    const criterias = await prisma.criteria.findMany()
    const updatedValuePriorityCriteria = criterias.map(async (item, index) => {
      const comparisonMatrix = createComparisonCriteriaMatrix(comparisonCriterias)
      const eigenValues = calculateEigenValues(comparisonMatrix)
      const normalizedValues = calculateNormalizedValues(
        comparisonMatrix,
        eigenValues
      )
      const weights = calculateWeight(normalizedValues)

      await prisma.criteria.update({
        where: { id: item.id },
        data: {
          valuePriority: weights[index],
        },
      })
    })

    await Promise.all(updatedValuePriorityCriteria)

    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

