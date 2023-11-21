'use server'

import { Prisma } from '@prisma/client'
import prisma from '../prisma/client'
import { studentScheme } from '../validations/analytic'
import { revalidatePath } from 'next/cache'
import { handlePrismaError } from '../prisma/errors'

export async function fecthAllStudent() {
  return await prisma.student.findMany()
}

export async function fetchStudentById(id: string){
  return await prisma.student.findUnique({
    where: {id: id}
  })
}

export async function createNewStudent(
  student: Prisma.StudentUncheckedCreateInput,
  path: string
): Promise<void> {
  const validation = studentScheme.safeParse(student)
  if (!validation.success) {
    throw new Error(`${validation.error.errors}`)
  }

  try {
    await prisma.student.create({
      data: student,
    })
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

export async function updateStudentById(
  id: string,
  student: Prisma.StudentUncheckedUpdateInput,
  path: string
): Promise<void> {
  const validation = studentScheme.safeParse(student)
  if (!validation.success) {
    throw new Error(`${validation.error.errors}`)
  }

  try {
    await prisma.student.update({
      where: { id: id },
      data: student,
    })
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

export async function deleteStudentById({
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
      await prisma.student.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      })
    } else if (id) {
      await prisma.student.delete({
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

