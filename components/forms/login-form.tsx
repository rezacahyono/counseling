'use client'

import { loginScheme } from '@/lib/validations/auth'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@nextui-org/react'
import Link from 'next/link'

const LoginForm = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginScheme>>({
    resolver: zodResolver(loginScheme),
  })

  const handleOnSubmit = handleSubmit(async data => {
    const toast = (await import('react-hot-toast')).default
    const signIn = (await import('next-auth/react')).signIn
    await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    })
      .then(value => {
        if (value?.error) {
          toast.error(value?.error ?? '')
        }
        router.push('/')
      })
      .catch((error: any) => {
        console.log(error.message)
      })
  })

  return (
    <form onSubmit={handleOnSubmit} className='flex flex-col space-y-6 p-8'>
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
        Masuk
      </Button>
      <p className='text-sm text-default-400 text-center'>
        Belum punya akun?{' '}
        <Link href='/register' className='font-bold text-default-500'>
          Daftar
        </Link>
      </p>
    </form>
  )
}

export default LoginForm

