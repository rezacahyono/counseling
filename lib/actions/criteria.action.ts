'use server'

import { Prisma } from '@prisma/client'
import prisma from '../prisma/client'
import { criteriaScheme } from '../validations/analytic'
import { handlePrismaError } from '../prisma/errors'
import { revalidatePath } from 'next/cache'

type Includes = {
  subcriteria?: boolean
}
export async function fetchAllCriteria(includes?: Includes) {
  return await prisma.criteria.findMany({
    include: {
      subcriteria: includes?.subcriteria,
    },
  })
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
    const comparisonCriterias: Prisma.ComparisonCriteriaUncheckedCreateInput[] =
      criterias.flatMap((criteria1, i) =>
        criterias.slice(i + 1).map(criteria2 => ({
          criteriaId1: criteria1.id,
          criteriaId2: criteria2.id,
        }))
      )

    await prisma.comparisonCriteria.createMany({
      data: comparisonCriterias,
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
    if (ids && ids.length > 0) {
      // const deleteComparisonSubcriteriaMany =
      //   prisma.comparisonSubcriteria.deleteMany({
      //     where: {
      //       OR: [
      //         {
      //           subcriteria1: {
      //             criteriaId: {
      //               in: ids,
      //             },
      //           },
      //         },
      //         {
      //           subcriteria2: {
      //             criteriaId: {
      //               in: ids,
      //             },
      //           },
      //         },
      //       ],
      //     },
      //   })

      // const deleteSubcriteriaMany = prisma.subcriteria.deleteMany({
      //   where: {
      //     criteriaId: {
      //       in: ids,
      //     },
      //   },
      // })

      // const deleteComparisonCriteriaMany = prisma.comparisonCriteria.deleteMany(
      //   {
      //     where: {
      //       OR: [{ criteriaId1: { in: ids } }, { criteriaId2: { in: ids } }],
      //     },
      //   }
      // )

      await prisma.criteria.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      })

      // await prisma.$transaction([
      //   deleteComparisonSubcriteriaMany,
      //   deleteSubcriteriaMany,
      //   deleteComparisonCriteriaMany,
      //   deleteCriteriaMany,
      // ])
    } else if (id) {
      // const deleteComparisonSubcriteria =
      //   prisma.comparisonSubcriteria.deleteMany({
      //     where: {
      //       OR: [
      //         {
      //           subcriteria1: {
      //             criteriaId: id,
      //           },
      //         },
      //         {
      //           subcriteria2: {
      //             criteriaId: id,
      //           },
      //         },
      //       ],
      //     },
      //   })

      // const deleteSubcriteria = prisma.subcriteria.deleteMany({
      //   where: { criteriaId: id },
      // })

      // const deleteComparisonCriteria = prisma.comparisonCriteria.deleteMany({
      //   where: {
      //     OR: [{ criteriaId1: id }, { criteriaId2: id }],
      //   },
      // })

      await prisma.criteria.delete({
        where: { id: id },
      })

      // await prisma.$transaction([
      //   deleteComparisonSubcriteria,
      //   deleteSubcriteria,
      //   deleteComparisonCriteria,
      //   deleteCriteria,
      // ])
    }

    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

