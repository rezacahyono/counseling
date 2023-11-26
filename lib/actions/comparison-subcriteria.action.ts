'use server'

import { Prisma } from '@prisma/client'
import prisma from '../prisma/client'
import { revalidatePath } from 'next/cache'
import {
  calculateEigenValues,
  calculateNormalizedValues,
  calculateWeight,
  createComparisonSubcriteriaMatrix,
} from '../ahp/analytic-hierarchy-process'

export async function fetchAllComparisonSubcriteria() {
  return await prisma.comparisonSubcriteria.findMany({
    orderBy: {
      subcriteriaId1: 'asc',
    },
    include: {
      subcriteria1: {
        include: {
          criteria: true,
        },
      },
      subcriteria2: {
        include: {
          criteria: true,
        },
      },
    },
  })
}

export async function updateComparisonSubcriteriaById(
  id: string,
  criteriaId: string,
  comparisonSubcriteria: Prisma.ComparisonSubcriteriaUncheckedUpdateInput,
  path: string
): Promise<void> {
  try {
    await prisma.comparisonSubcriteria.update({
      where: { id: id },
      data: comparisonSubcriteria,
    })

    const comparisonSubcriterias = await prisma.comparisonSubcriteria.findMany({
      where: {
        subcriteria1: {
          criteriaId: criteriaId,
        },
      },
    })

    const subcriterias = await prisma.subcriteria.findMany({
      where: {
        criteriaId: criteriaId,
      },
    })
    const updateValuePrioritySubcriteria = subcriterias.map(
      async (item, index) => {
        const comparisonMatrix = createComparisonSubcriteriaMatrix(
          comparisonSubcriterias
        )
        const eigenValues = calculateEigenValues(comparisonMatrix)
        const normalizedValues = calculateNormalizedValues(
          comparisonMatrix,
          eigenValues
        )
        const weights = calculateWeight(normalizedValues)

        await prisma.subcriteria.update({
          where: { id: item.id },
          data: {
            valuePriority: weights[index],
          },
        })
      }
    )

    await Promise.all(updateValuePrioritySubcriteria)

    revalidatePath(path)
  } catch (error) {}
}

