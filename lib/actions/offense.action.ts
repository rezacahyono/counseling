'use server'

import { Criteria, Offense, Prisma, Subcriteria } from '@prisma/client'
import prisma from '../prisma/client'
import { offenseScheme } from '../validations/analytic'
import { handlePrismaError } from '../prisma/errors'
import { revalidatePath } from 'next/cache'

type Includes = {
  criteria?: boolean
  student?: boolean
  subcriteria?: boolean
}
export async function fetchAllOffense(includes?: Includes, take?: number) {
  return await prisma.offense.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      criteria: includes?.criteria,
      subcriteria: includes?.subcriteria,
      student: includes?.student,
    },
    take: take,
  })
}

export async function createNewOffense(
  offense: Prisma.OffenseUncheckedCreateInput,
  path: string
): Promise<void> {
  const validation = offenseScheme.safeParse(offense)
  if (!validation.success) {
    throw new Error(`${validation.error.errors}`)
  }
  try {
    await prisma.offense.create({
      data: offense,
    })

    const student = await prisma.student.findUnique({
      where: { id: offense.studentId },
      include: {
        offence: {
          include: {
            subcriteria: true,
            criteria: true,
          },
        },
      },
    })

    if (student) {
      const totalPoin = calculateTotalPoin(student.offence)

      const totalValuePriorityCriteria = calculateTotalValuePriority(
        'criteria',
        student.offence
      )
      const totalValuePrioritySubcriteria = calculateTotalValuePriority(
        'subcriteria',
        student.offence
      )

      const finalTotalPoin =
        totalPoin + totalValuePriorityCriteria * totalValuePrioritySubcriteria

      const actionSchool = (await prisma.actionSchool.findMany()).find(
        item =>
          item.poinStart <= finalTotalPoin && finalTotalPoin <= item.poinEnd
      )

      if (actionSchool) {
        await prisma.recomendation.upsert({
          where: { studentId: student.id },
          update: {
            totalPoin: finalTotalPoin,
            actionSchoolId: actionSchool.id,
          },
          create: {
            studentId: student.id,
            totalPoin: finalTotalPoin,
            actionSchoolId: actionSchool.id,
          },
        })
      }
    }

    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

export async function updateOffenseById(
  id: string,
  offenses: Prisma.OffenseUncheckedUpdateInput,
  path: string
): Promise<void> {
  const validation = offenseScheme.safeParse(offenses)
  if (!validation.success) {
    throw new Error(`${validation.error.errors}`)
  }
  try {
    await prisma.offense.update({
      where: { id: id },
      data: offenses,
    })

    const offense = await prisma.offense.findUnique({
      where: { id: id },
    })

    if (offense) {
      const student = await prisma.student.findUnique({
        where: { id: offense.studentId },
        include: {
          offence: {
            include: {
              subcriteria: true,
              criteria: true,
            },
          },
        },
      })

      if (student) {
        const totalPoin = calculateTotalPoin(student.offence)

        const totalValuePriorityCriteria = calculateTotalValuePriority(
          'criteria',
          student.offence
        )
        const totalValuePrioritySubcriteria = calculateTotalValuePriority(
          'subcriteria',
          student.offence
        )

        const finalTotalPoin =
          totalPoin + totalValuePriorityCriteria * totalValuePrioritySubcriteria

        const actionSchool = (await prisma.actionSchool.findMany()).find(
          item =>
            item.poinStart <= finalTotalPoin && finalTotalPoin <= item.poinEnd
        )

        if (actionSchool) {
          await prisma.recomendation.update({
            where: { studentId: student.id },
            data: {
              totalPoin: finalTotalPoin,
              actionSchoolId: actionSchool.id,
            },
          })
        }
      }
    }

    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

export async function deleteOffenseById({
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
      const studentIds = await prisma.offense.findMany({
        where: { id: { in: ids } },
        select: { studentId: true },
      })

      await prisma.offense.deleteMany({
        where: { id: { in: ids } },
      })

      for (const studentIdObject of [
        ...new Set(studentIds.flatMap(item => [item.studentId])),
      ]) {
        const studentId = studentIdObject

        if (studentId) {
          const offenseCountByStudentId = await prisma.offense.count({
            where: { studentId },
          })

          if (offenseCountByStudentId === 0) {
            await prisma.recomendation.delete({
              where: { studentId: studentId },
            })
          } else {
            const student = await prisma.student.findUnique({
              where: { id: studentId },
              include: {
                offence: {
                  include: {
                    subcriteria: true,
                    criteria: true,
                  },
                },
              },
            })

            if (student) {
              const totalPoin = calculateTotalPoin(student.offence)

              const totalValuePriorityCriteria = calculateTotalValuePriority(
                'criteria',
                student.offence
              )
              const totalValuePrioritySubcriteria = calculateTotalValuePriority(
                'subcriteria',
                student.offence
              )

              const finalTotalPoin =
                totalPoin +
                totalValuePriorityCriteria * totalValuePrioritySubcriteria

              const actionSchool = (await prisma.actionSchool.findMany()).find(
                item =>
                  item.poinStart <= finalTotalPoin &&
                  finalTotalPoin <= item.poinEnd
              )

              if (actionSchool) {
                await prisma.recomendation.update({
                  where: { studentId: student.id },
                  data: {
                    totalPoin: finalTotalPoin,
                    actionSchoolId: actionSchool.id,
                  },
                })
              }
            }
          }
        }
      }
    } else if (id) {
      const offense = await prisma.offense.findUnique({
        where: { id },
        select: { studentId: true },
      })

      if (offense) {
        const studentId = offense.studentId

        await prisma.offense.delete({
          where: { id },
        })

        if (studentId) {
          const offenseCountByStudentId = await prisma.offense.count({
            where: { studentId },
          })

          if (offenseCountByStudentId === 0) {
            await prisma.recomendation.delete({
              where: { studentId },
            })
          } else {
            const student = await prisma.student.findUnique({
              where: { id: studentId },
              include: {
                offence: {
                  include: {
                    subcriteria: true,
                    criteria: true,
                  },
                },
              },
            })

            if (student) {
              const totalPoin = calculateTotalPoin(student.offence)

              const totalValuePriorityCriteria = calculateTotalValuePriority(
                'criteria',
                student.offence
              )
              const totalValuePrioritySubcriteria = calculateTotalValuePriority(
                'subcriteria',
                student.offence
              )

              const finalTotalPoin =
                totalPoin +
                totalValuePriorityCriteria * totalValuePrioritySubcriteria

              const actionSchool = (await prisma.actionSchool.findMany()).find(
                item =>
                  item.poinStart <= finalTotalPoin &&
                  finalTotalPoin <= item.poinEnd
              )

              if (actionSchool) {
                await prisma.recomendation.update({
                  where: { studentId: student.id },
                  data: {
                    totalPoin: finalTotalPoin,
                    actionSchoolId: actionSchool.id,
                  },
                })
              }
            }
          }
        }
      }
    }
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

function calculateTotalPoin(
  offenses: ({ subcriteria: Subcriteria } & Offense)[]
): number {
  return offenses.reduce((acc, offense) => acc + offense.subcriteria.poin, 0)
}

function calculateTotalValuePriority(
  key: 'criteria' | 'subcriteria',
  offenses: ({ subcriteria: Subcriteria; criteria: Criteria } & Offense)[]
): number {
  return offenses.reduce(
    (acc, offense) => acc + (offense[key]?.valuePriority || 0),
    0
  )
}

