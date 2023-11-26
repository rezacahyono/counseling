'use client'

import React from 'react'
import { loginScheme } from '@/lib/validations/auth'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Link } from '@nextui-org/react'
import InputForm from '../input/input-form'
import { signIn } from 'next-auth/react'

export default function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginScheme>>({
    resolver: zodResolver(loginScheme),
  })

  const handleOnSubmit = handleSubmit(async data => {
    const toast = (await import('react-hot-toast')).default
    setIsLoading(true)
    try {
      await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      }).then(value => {
        if (value?.ok) {
          router.push('/')
        } else {
          toast.error('Login gagal')
        }
      })
      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)
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
        isLoading={isLoading}
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

