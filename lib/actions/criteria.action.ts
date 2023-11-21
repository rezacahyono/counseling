'use server'
import { Prisma } from '@prisma/client'
import prisma from '../prisma/client'
import { criteriaScheme } from '../validations/analytic'
import { handlePrismaError } from '../prisma/errors'
import { revalidatePath } from 'next/cache'

export async function fetchAllCriteria() {
  return await prisma.criteria.findMany()
}

export async function createNewCriteria({
  name,
  path,
}: {
  name: string
  path: string
}): Promise<void> {
  const validation = criteriaScheme.safeParse({ name })
  if (!validation.success) {
    throw new Error(`${validation.error.errors}`)
  }

  try {
    await prisma.criteria.create({
      data: {
        name: name,
      },
    })

    const criterias = await prisma.criteria.findMany()
    const comparisonCriteriasArray: Prisma.ComparisonCriteriaUncheckedCreateInput[] =
      []

    await Promise.all(
      criterias.map(async (criteria1, i) => {
        await Promise.all(
          criterias.slice(i + 1).map(async criteria2 => {
            comparisonCriteriasArray.push({
              criteriaId1: criteria1.id,
              criteriaId2: criteria2.id,
            })
          })
        )
      })
    )

    await prisma.comparisonCriteria.createMany({
      data: comparisonCriteriasArray,
      skipDuplicates: true,
    })

    revalidatePath(path)
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

export async function updateCriteriaById({
  id,
  name,
  path,
}: {
  id: string
  name: string
  path: string
}): Promise<void> {
  const validation = criteriaScheme.safeParse({ name })
  if (!validation.success) {
    throw new Error(`${validation.error.errors}`)
  }

  try {
    await prisma.criteria.update({
      where: { id: id },
      data: {
        name: name,
      },
    })
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

export async function deleteCriteriaById({
  id,
  ids,
  path,
}: {
  id?: string
  ids?: string[]
  path: string
}): Promise<void> {
  try {
    if (ids) {
      const deleteSubcriteriaMany = prisma.subcriteria.deleteMany({
        where: {
          criteriaId: {
            in: ids,
          },
        },
      })
      const deleteComparisonCriteriaMany = prisma.comparisonCriteria.deleteMany(
        {
          where: {
            OR: [
              {
                criteriaId1: {
                  in: ids,
                },
              },
              {
                criteriaId1: {
                  in: ids,
                },
              },
            ],
          },
        }
      )
      const deleteCriteriaMany = prisma.criteria.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      })
      await prisma.$transaction([
        deleteSubcriteriaMany,
        deleteComparisonCriteriaMany,
        deleteCriteriaMany,
      ])
    } else if (id) {
      const deleteSubcriteria = prisma.subcriteria.deleteMany({
        where: { criteriaId: id },
      })
      const deleteComparisonCriteria = prisma.comparisonCriteria.deleteMany({
        where: {
          OR: [{ criteriaId1: id }, { criteriaId2: id }],
        },
      })
      const deleteCriteria = prisma.criteria.delete({
        where: { id: id },
      })
      await prisma.$transaction([
        deleteSubcriteria,
        deleteComparisonCriteria,
        deleteCriteria,
      ])
    }
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

