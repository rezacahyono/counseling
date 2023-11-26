'use server'

import { Prisma } from '@prisma/client'
import prisma from '../prisma/client'
import { subcriteriaScheme } from '../validations/analytic'
import { handlePrismaError } from '../prisma/errors'
import { revalidatePath } from 'next/cache'

type Includes = {
  criteria?: boolean
}
export async function fetchAllSubcriteria(include?: Includes) {
  return await prisma.subcriteria.findMany({
    include: {
      criteria: include?.criteria,
    },
  })
}

export async function createNewSubcriteria(
  subcriteria: Prisma.SubcriteriaUncheckedCreateInput,
  path: string
): Promise<void> {
  const validation = subcriteriaScheme.safeParse(subcriteria)
  if (!validation.success) {
    throw new Error(`${validation.error.errors}`)
  }

  try {
    await prisma.subcriteria.create({
      data: subcriteria,
    })

    const subcriterias = await prisma.subcriteria.findMany()
    const comparisonSubcriteris: Prisma.ComparisonSubcriteriaUncheckedCreateInput[] =
      subcriterias.flatMap((subcriteria1, index1) =>
        subcriterias
          .slice(index1 + 1)
          .filter(
            subcriteria2 => subcriteria1.criteriaId === subcriteria2.criteriaId
          )
          .map(subcriteria2 => ({
            subcriteriaId1: subcriteria1.id,
            subcriteriaId2: subcriteria2.id,
          }))
      )

    await prisma.comparisonSubcriteria.createMany({
      data: comparisonSubcriteris,
      skipDuplicates: true,
    })
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

export async function updateSubcriteriaById(
  id: string,
  subcriteria: Prisma.SubcriteriaUncheckedUpdateInput,
  path: string
) {
  const validation = subcriteriaScheme.safeParse(subcriteria)
  if (!validation.success) {
    throw new Error(`${validation.error.errors}`)
  }

  try {
    await prisma.subcriteria.update({
      where: { id: id },
      data: subcriteria,
    })
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

export async function deleteSubcriteriaById({
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
      //           subcriteriaId1: {
      //             in: ids,
      //           },
      //         },
      //         {
      //           subcriteriaId2: {
      //             in: ids,
      //           },
      //         },
      //       ],
      //     },
      //   })
      await prisma.subcriteria.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      })
      // await prisma.$transaction([
      //   deleteComparisonSubcriteriaMany,
      //   deleteSubcriteriaMany,
      // ])
    } else if (id) {
      // const deleteComparisonSubcriteria =
      //   prisma.comparisonSubcriteria.deleteMany({
      //     where: {
      //       OR: [{ subcriteriaId1: id }, { subcriteriaId2: id }],
      //     },
      //   })
      await prisma.subcriteria.delete({
        where: {
          id: id,
        },
      })
      // await prisma.$transaction([
      //   deleteComparisonSubcriteria,
      //   deleteSubcriteria,
      // ])
    }
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

