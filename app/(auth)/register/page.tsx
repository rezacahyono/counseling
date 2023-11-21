'use client'
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Link,
} from '@nextui-org/react'
import dynamic from 'next/dynamic'
import React from 'react'
const RegisterForm = dynamic(() => import('@/components/forms/register-form'))

const RegisterPage = () => {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <Card className='z-10 max-w-md shadow-xl'>
        <CardHeader className='flex flex-col items-center justify-center space-y-3 px-4 py-6 sm:px-16 text-center'>
          <Link href='/'>
            <Image
              src='/img/logo.webp'
              alt='Logo'
              className='h-auto w-auto rounded-full'
              width={100}
              height={100}
            />
          </Link>
          <h3 className='text-xl font-semibold'>Daftar</h3>
          <p className='text-sm text-default-500'>
            Buat akun dengan username, email dan kata sandi.
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          <RegisterForm />
        </CardBody>
      </Card>
    </div>
  )
}

export default RegisterPage

