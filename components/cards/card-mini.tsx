import React from 'react'

type Props = {
  title: string
  count: string
  prefix: string
  icon: React.ReactNode
}
export default function CardMini({ title, count, prefix, icon }: Props) {
  return (
    <div className='w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4'>
      <div className='shadow-soft-xl rounded-xl bg-content1 p-4'>
        <div className='flex flex-row'>
          <div className='flex flex-col flex-1 max-w-full px-2'>
            <p className='text-base font-normal text-default-600'>{title}</p>
            <p className='font-bold text-xl'>
              {count}
              <span className='text-sm leading-normal font-normal text-secondary px-2'>
                {prefix}
              </span>
            </p>
          </div>
          <div className='px-2'>
            <div className='flex items-center justify-center w-12 h-12 text-zinc-50  rounded-lg bg-gradient-to-tl from-primary to-secondary shadow-md shadow-primary'>
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

