'use server'

import { Prisma, User } from '@prisma/client'
import prisma from '../prisma/client'
import { registerScheme } from '../validations/auth'
import { compare, hash } from 'bcrypt'
import { handlePrismaError } from '../prisma/errors'
import { revalidatePath } from 'next/cache'

export async function fetchUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email },
  })
}

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

export async function updateUserByEmail(
  email: string,
  user: Prisma.UserUncheckedUpdateInput,
  path: string
): Promise<void> {
  try {
    await prisma.user.update({
      where: { email: email },
      data: user,
    })
    
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error)
    }
  }
}

const exclude = (user: User, keys: [string]) => {
  for (let key of keys) {
    delete user[key as keyof User]
  }
  return user
}

