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
      await prisma.criteria.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      })

    } else if (id) {
      await prisma.criteria.delete({
        where: { id: id },
      })
    }

    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

