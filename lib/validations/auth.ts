import { z } from 'zod'

export const loginScheme = z.object({
  email: z.string().min(1, 'Email harus diisi').email('Email harus valid'),
  password: z.string().min(6, 'Password harus 6 digit'),
})

export const registerScheme = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  email: z.string().min(1, 'Email harus diisi').email('Email harus valid'),
  password: z.string().min(6, 'Password harus 6 digit'),
})

export const userScheme = z.object({
  
})

