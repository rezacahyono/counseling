'use server'

import { Prisma } from '@prisma/client'
import prisma from '../prisma/client'
import { studentScheme } from '../validations/analytic'
import { revalidatePath } from 'next/cache'
import { handlePrismaError } from '../prisma/errors'

export async function fetchAllStudent() {
  return await prisma.student.findMany()
}

export async function fetchStudentById(id: string) {
  return await prisma.student.findUnique({
    where: { id: id },
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
    if (ids && ids.length > 0) {
      // const deleteRecomendationMany = prisma.recomendation.deleteMany({
      //   where: { studentId: { in: ids } },
      // })
      // const deleteOffenseMany = prisma.offense.deleteMany({
      //   where: { studentId: { in: ids } },
      // })
      const deleteStudentMany = prisma.student.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      })

      await prisma.$transaction([
        deleteStudentMany,
      ])
    } else if (id) {
      // const deleteRecomendation = prisma.recomendation.delete({
      //   where: { studentId: id },
      // })
      // const deleteOffense = prisma.offense.deleteMany({
      //   where: { studentId: id },
      // })
      const deleteStudent = prisma.student.delete({
        where: { id: id },
      })

      await prisma.$transaction([
        deleteStudent,
      ])
    }
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

