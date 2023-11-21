'use server'

import { Prisma, User } from '@prisma/client'
import prisma from '../prisma/client'
import { registerScheme } from '../validations/auth'
import { compare, hash } from 'bcrypt'
import { handlePrismaError } from '../prisma/errors'

export async function fecthUserByEmailPassword(
  email: string,
  password: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    })
    if (user && (await compare(password, user.password))) {
      return exclude(user, ['password'])
    } else {
      throw new Error(`email atau password salah.`)
    }
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
    throw new Error(`Gagal login`)
  }
}

type Params = {
  name: string
  email: string
  password: string
}

export async function createNewUser({
  name,
  email,
  password,
}: Params): Promise<void> {
  const validation = registerScheme.safeParse({ name, email, password })
  if (!validation.success) {
    throw new Error(`${validation.error.errors}`)
  }
  try {
    const hashPassword = await hash(password, 10)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    })
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
    throw new Error(`Gagal register`)
  }
}

const exclude = (user: User, keys: [string]) => {
  for (let key of keys) {
    delete user[key as keyof User]
  }
  return user
}

