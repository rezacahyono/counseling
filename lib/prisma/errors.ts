import { Prisma } from '@prisma/client'

export const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError
) => {
  switch (error.code) {
    case 'P2002':
      return new Error(`Duplicate field value: ${error?.meta?.target}`)
    case 'P2014':
      return new Error(`Invalid ID: ${error?.meta?.target}`)
    case 'P2003':
      return new Error(`Invalid input data: ${error?.meta?.target}`)
    default:
      return new Error(`Something went wrong: ${error.message}`)
  }
}
