import { Avatar, Button, Card, CardBody, Image, Input } from '@nextui-org/react'
import React, { ChangeEvent } from 'react'

export default function CardEditUser() {


  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault()
  }
  return (
    <div className='px-3 w-full '>
      <Card className='shadow-soft-xl h-full'>
        <CardBody>
          <h5 className='w-full px-6 text-lg font-medium text-center py-3'>
            Edit Profil
          </h5>
          <div className='py-2'>
            <div className='max-w-full px-3 pb-4 w-full lg:px-6 lg:w-8/12 gap-4 flex flex-col'>
              <div className='flex flex-wrap sm:flex-nowrap items-center justify-center gap-4'>
                <Avatar
                  isBordered
                  className='w-20 h-20 text-large p-5'
                  radius='sm'
                  src='img/profile.svg'
                />
                <Input
                  variant='bordered'
                  isClearable
                  radius='lg'
                  type='file'
                  accept='image/*'
                  labelPlacement='outside'
                  placeholder='Upload avatar'
                  // onChange={(e) => handleImage(e,fi)}
                  classNames={{
                    input: [
                      '-mx-3 rounded-xl',
                      'file:bg-gray-50 file:border-0',
                      'file:bg-gray-100',
                      'file:py-2 file:px-3 file:-pl-6 file:mr-4',
                      'dark:file:bg-gray-700 dark:file:text-gray-400',
                    ],
                  }}
                />
              </div>

              <Input
                label='Nama'
                variant='bordered'
                isClearable
                radius='lg'
                type='name'
                labelPlacement='outside'
                placeholder='Inputkan nama'
              />

              <Input
                label='Password Baru'
                variant='bordered'
                isClearable
                radius='lg'
                type='password'
                labelPlacement='outside'
                placeholder='Inputkan password baru'
              />

              <Input
                label='Konfirmasi Password Baru'
                variant='bordered'
                isClearable
                radius='lg'
                type='password'
                labelPlacement='outside'
                placeholder='Inputkan konfirmasi password baru'
              />
            </div>
          </div>
          <Button
            className='max-w-xs mx-3 lg:mx-6 mb-6'
            color='primary'
            variant='shadow'
          >
            Submit
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}

