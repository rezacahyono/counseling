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
    if (ids) {
      await prisma.subcriteria.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      })
    } else if (id) {
      await prisma.subcriteria.delete({
        where: {
          id: id,
        },
      })
    }
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

