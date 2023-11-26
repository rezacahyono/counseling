import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import PageWrapper from '@/components/wrapper/page-wrapper'

const LoginForm = dynamic(() => import('@/components/forms/login-form'))

export default function LoginPage() {
  return (
    <PageWrapper>
      <div className='flex h-screen w-screen items-center justify-center'>
        <div className='z-10 max-w-md shadow-xl bg-content1 rounded-2xl divide-y divide-default-200'>
          <div className='flex flex-col items-center justify-center space-y-3 px-4 py-6 sm:px-16 text-center'>
            <Link href='/'>
              <Image
                src='/img/logo.webp'
                alt='Logo'
                className='h-auto w-auto rounded-full'
                width={70}
                height={70}
                priority
              />
            </Link>
            <h3 className='text-xl font-semibold'>Masuk</h3>
            <p className='text-sm text-default-500'>
              Gunakan email dan kata sandi anda untuk masuk.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </PageWrapper>
  )
}

