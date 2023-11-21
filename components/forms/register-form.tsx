'use client'

import { registerScheme } from '@/lib/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function RegisterForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof registerScheme>>({
    resolver: zodResolver(registerScheme),
  })

  const handleOnSubmit = handleSubmit(async data => {
    const toast = (await import('react-hot-toast')).default
    const createNewUser = (await import('@/lib/actions/user.action'))
      .createNewUser
    try {
      await createNewUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      toast.success('Akun dibuat! Mengalihkan ke halaman masuk...')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message)
    }
  })

  return (
    <form onSubmit={handleOnSubmit} className='flex flex-col space-y-6 p-8'>
      <Input
        type='name'
        label='Nama'
        fullWidth
        variant='bordered'
        {...register('name')}
        isInvalid={errors.name ? true : false}
        errorMessage={errors.name?.message}
      />
      <Input
        type='email'
        label='Email'
        fullWidth
        variant='bordered'
        {...register('email')}
        isInvalid={errors.email ? true : false}
        errorMessage={errors.email?.message}
      />
      <Input
        type='password'
        label='Password'
        fullWidth
        variant='bordered'
        {...register('password')}
        isInvalid={errors.password ? true : false}
        errorMessage={errors.password?.message}
      />
      <Button
        color='primary'
        variant='shadow'
        isLoading={isSubmitting}
        type='submit'
      >
        Daftar
      </Button>
      <p className='text-sm text-default-400 text-center'>
        Sudah punya akun?{' '}
        <Link href='/login' className='font-bold text-default-500'>
          Masuk
        </Link>
      </p>
    </form>
  )
}

