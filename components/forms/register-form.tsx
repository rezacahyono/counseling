'use client'

import React from 'react'
import { registerScheme } from '@/lib/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Link } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import InputForm from '../input/input-form'

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
    const { createNewUser } = await import('@/lib/actions/user.action')
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
      <InputForm
        label={'Nama'}
        name={'name'}
        register={register}
        errors={errors}
        type='text'
      />
      <InputForm
        label={'Email'}
        name={'email'}
        register={register}
        errors={errors}
        type='text'
      />

      <InputForm
        label={'Password'}
        name={'password'}
        register={register}
        errors={errors}
        type='password'
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

