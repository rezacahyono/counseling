'use client'

import React from 'react'
import { loginScheme } from '@/lib/validations/auth'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Link } from '@nextui-org/react'
import InputForm from '../input/input-form'

export default function LoginForm() {
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
    const { signIn } = await import('next-auth/react')
    try {
      await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      }).then(value => {
        console.log(value?.ok)
        if (value?.ok) {
          router.push('/')
        } else {
          toast.error(value?.error ?? '')
        }
      })
    } catch (error: any) {
      console.error('Error during sign in:', error.message)
    }
  })

  return (
    <form onSubmit={handleOnSubmit} className='flex flex-col space-y-6 p-8'>
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

