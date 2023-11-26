'use server'

import prisma from '../prisma/client'

type Includes = {
  student?: boolean
  actionSchool?: boolean
  offense?: boolean
  criteria?: boolean
  subcriteria?: boolean
}
export async function fetchAllRecomendation(
  includes?: Includes,
  sort?: { createdAt?: 'asc' | 'desc'; totalPoin?: 'asc' | 'desc' },
  take?: number
) {
  return prisma.recomendation.findMany({
    orderBy: {
      createdAt: sort?.createdAt,
      totalPoin: sort?.totalPoin,
    },
    include: {
      student: includes?.student,
      actionSchool: includes?.actionSchool,
    },
    take: take,
  })
}

export async function fetchRecomendationById(id: string, includes?: Includes) {
  return prisma.recomendation.findUnique({
    where: { id: id },
    include: {
      student: {
        include: {
          offence: {
            include: {
              criteria: includes?.criteria,
              subcriteria: includes?.subcriteria,
            },
          },
        },
      },
      actionSchool: includes?.actionSchool,
    },
  })
}

