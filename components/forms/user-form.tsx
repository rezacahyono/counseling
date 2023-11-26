'use client'
import { updateUserByEmail } from '@/lib/actions/user.action'
import { useUploadThing } from '@/lib/uploadthing'
import { userScheme } from '@/lib/validations/auth'
import { isBase64Image } from '@/utils/util'
import { Avatar, Button, Input } from '@nextui-org/react'
import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
  user: User | null
}
export default function UserForm({ user }: Props) {
  const pathname = usePathname()
  const [files, setFiles] = React.useState<File[]>([])
  const { startUpload } = useUploadThing('media')
  const { update } = useSession()

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof userScheme>>({
    defaultValues: {
      image: user?.image || '',
      name: user?.name || '',
    },
    mode: 'onChange',
  })

  const onSubmit = handleSubmit(async data => {
    const toast = (await import('react-hot-toast')).default
    const blob = data.image

    const hasImageChanged = isBase64Image(blob)
    if (hasImageChanged) {
      const imgRes = await startUpload(files)

      if (imgRes && imgRes[0].url) {
        data.image = imgRes[0].url
      }
    }
    if (user) {
      const res = updateUserByEmail(
        user.email,
        {
          image: data.image,
          name: data.name,
        },
        pathname
      )
      toast.promise(res, {
        loading: 'Menyimpan...',
        success: <b>User berhasil diubah...</b>,
        error: <b>User gagal diubah!.</b>,
      })
      update({ name: data.name, image: data.image })
    }
  })

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault()

    const fileReader = new FileReader()
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFiles(Array.from(e.target.files))
      if (!file.type.includes('image')) return

      fileReader.onload = async event => {
        const imageDataUrl = event.target?.result?.toString() || ''
        fieldChange(imageDataUrl)
      }
      fileReader.readAsDataURL(file)
    }
  }

  return (
    <div className='px-3 w-full'>
      <div className='shadow-soft-xl h-full rounded-xl'>
        <div className='flex flex-col'>
          <h5 className='w-full px-6 text-lg font-medium text-center py-3'>
            Edit Profil
          </h5>
          <div className='py-2'>
            <form id='form-user' onSubmit={onSubmit}>
              <div className='max-w-full px-3 pb-4 w-full lg:px-6 lg:w-8/12 gap-6 flex flex-col '>
                <div className='flex flex-wrap sm:flex-nowrap items-center justify-center gap-6'>
                  <Controller
                    name='image'
                    control={control}
                    render={({ field }) => (
                      <>
                        <Avatar
                          isBordered
                          className='w-20 h-20 text-large'
                          radius='sm'
                          src={field.value ? field.value : 'img/profile.svg'}
                        />
                        <Input
                          variant='bordered'
                          radius='lg'
                          type='file'
                          accept='image/*'
                          labelPlacement='outside'
                          placeholder='Upload avatar'
                          onChange={e => handleImage(e, field.onChange)}
                          classNames={{
                            input: [
                              '-mx-3 rounded-xl',
                              'file:bg-content2 text-default-700 file:border-0',
                              'file:py-2 file:px-3 file:-pl-6 file:mr-4',
                            ],
                          }}
                          isInvalid={!!errors.image}
                          errorMessage={errors.image?.message}
                        />
                      </>
                    )}
                  />
                </div>
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <Input
                      label='Nama'
                      variant='bordered'
                      radius='lg'
                      {...field}
                      labelPlacement='outside'
                      placeholder='Inputkan nama'
                      isInvalid={!!errors.name}
                      errorMessage={errors.name?.message}
                    />
                  )}
                />
              </div>
            </form>
          </div>
          <Button
            className='lg:max-w-xs mx-3 lg:mx-6 mb-6'
            color='primary'
            variant='shadow'
            type='submit'
            form='form-user'
            isLoading={isSubmitting}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

