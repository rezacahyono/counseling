import { fetchUserByEmail } from '@/lib/actions/user.action'
import { getServerSession } from 'next-auth'
import dynamic from 'next/dynamic'
import React from 'react'

const PageWrapper = dynamic(() => import('@/components/wrapper/page-wrapper'))

const Breadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/breadcrumbs')
)
const UserForm = dynamic(() => import('@/components/forms/user-form'))
const CardProfileUser = dynamic(
  () => import('@/components/cards/card-profile-user')
)

const SettingPage = async () => {
  const session = await getServerSession()
  if (!session?.user?.email) return null

  const userInfo = await fetchUserByEmail(session.user.email)

  return (
    <PageWrapper>
      <div className='w-full px-6 py-6 mx-auto'>
        <div className='pb-4'>
          <Breadcrumbs />
        </div>
        <div className='relative bg-[url("/img/curved.webp")] w-full rounded-xl max-h-40 h-screen bg-cover'>
          <span className='absolute inset-y-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-primary to-secondary opacity-70 rounded-xl' />
        </div>
        <div className='relative flex flex-col flex-auto min-w-0 p-4 mx-6 -mt-10 overflow-hidden break-words border-0 rounded-2xl bg-default-200/70 bg-clip-border backdrop-blur-2xl backdrop-saturate-200 shadow-soft-xl'>
          <div className='flex flex-wrap -mx-3'>
            <CardProfileUser user={userInfo} />
          </div>
        </div>
        <div className='flex flex-wrap -mx-3 mt-6'>
          <UserForm user={userInfo} />
        </div>
      </div>
    </PageWrapper>
  )
}

export default SettingPage

