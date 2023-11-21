'use server'

import { Prisma } from '@prisma/client'
import prisma from '../prisma/client'
import { revalidatePath } from 'next/cache'
import { handlePrismaError } from '../prisma/errors'

export async function fetchAllActionSchool() {
  return await prisma.actionSchool.findMany()
}

export async function createNewActionSchool(
  actionSchool: Prisma.ActionSchoolUncheckedCreateInput,
  path: string
): Promise<void> {
  try {
    await prisma.actionSchool.create({
      data: actionSchool,
    })
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

export async function updateActionSchoolById(
  id: string,
  actionSchool: Prisma.ActionSchoolUncheckedUpdateInput,
  path: string
): Promise<void> {
  try {
    await prisma.actionSchool.update({
      where: { id: id },
      data: actionSchool,
    })
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

export async function deleteActionSchoolById({
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
      await prisma.actionSchool.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      })
    } else if (id) {
      await prisma.actionSchool.delete({
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

