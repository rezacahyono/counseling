'use client'

import { classGrade, gender } from '@/constants/data'
import { studentScheme } from '@/lib/validations/analytic'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import { Student } from '@prisma/client'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BiSolidEdit } from 'react-icons/bi'
import { z } from 'zod'

type Props = {
  student?: Student
}
const StudentForm = ({ student }: Props) => {
  const pathname = usePathname()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof studentScheme>>({
    resolver: zodResolver(studentScheme),
    defaultValues: {
      nis: student?.nis || '',
      name: student?.name || '',
      address: student?.address || '',
      nameParent: student?.nameParent || '',
      phoneNumberParent: student?.phoneNumberParent || '',
    },
  })

  const onSubmit = handleSubmit(async data => {
    const createNewStudent = (await import('@/lib/actions/student.action'))
      .createNewStudent
    const updateStudentById = (await import('@/lib/actions/student.action'))
      .updateStudentById
    const toast = (await import('react-hot-toast')).default
    let res = Promise.resolve()
    if (!student) {
      res = createNewStudent(
        {
          nis: data.nis,
          name: data.name,
          address: data.address,
          class: data.class,
          gender: data.gender,
          nameParent: data.nameParent,
          phoneNumberParent: data.phoneNumberParent,
        },
        pathname
      )
    } else {
      res = updateStudentById(
        student.id,
        {
          nis: data.nis,
          name: data.name,
          address: data.address,
          class: data.class,
          gender: data.gender,
          nameParent: data.nameParent,
          phoneNumberParent: data.phoneNumberParent,
        },
        pathname
      )
    }
    toast.promise(res, {
      loading: 'Menyimpan...',
      success: <b>Data siswa berhasil disimpan...</b>,
      error: <b>Data siswa gagal disimpan!.</b>,
    })
    reset()
  })
  return (
    <>
      {student ? (
        <Tooltip content='Ubah siswa'>
          <span
            className='text-xl text-default-400 cursor-pointer active:opacity-50'
            onClick={() => {
              reset()
              onOpen()
            }}
          >
            <BiSolidEdit />
          </span>
        </Tooltip>
      ) : (
        <Button
          onClick={() => {
            reset()
            onOpen()
          }}
          color='primary'
          variant='shadow'
        >
          Tambah Siswa
        </Button>
      )}
      <Modal
        closeButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior='inside'
        placement='center'
        size='3xl'
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>
                <h4 className='mb-2 mt-5 text-2xl font-medium leading-tight'>
                  {student ? 'Ubah Siswa' : 'Tambah Siswa'}
                </h4>
              </ModalHeader>
              <Divider />
              <ModalBody className='py-6'>
                <form id='form-student' onSubmit={onSubmit}>
                  <div className='flex flex-col box-border flex-wrap gap-8 lg:flex-nowrap lg:gap-6'>
                    <div className='flex flex-row box-border gap-6 flex-wrap lg:flex-nowrap'>
                      <Controller
                        name='nis'
                        control={control}
                        render={({ field }) => (
                          <Input
                            autoFocus
                            label='NIS'
                            variant='bordered'
                            fullWidth
                            isClearable
                            size='lg'
                            maxLength={8}
                            labelPlacement='outside'
                            placeholder='Inputkan NIS'
                            {...field}
                            isInvalid={errors.nis ? true : false}
                            errorMessage={errors.nis?.message}
                          />
                        )}
                      />
                      <Controller
                        name='name'
                        control={control}
                        render={({ field }) => (
                          <Input
                            label='Nama'
                            variant='bordered'
                            fullWidth
                            isClearable
                            size='lg'
                            labelPlacement='outside'
                            placeholder='Inputkan nama'
                            {...field}
                            isInvalid={errors.name ? true : false}
                            errorMessage={errors.name?.message}
                          />
                        )}
                      />
                    </div>
                    <div className='flex flex-row box-border gap-6 flex-wrap lg:flex-nowrap'>
                      <Select
                        defaultSelectedKeys={
                          student?.class ? [student?.class] : []
                        }
                        label='Kelas'
                        placeholder='Pilih kelas'
                        fullWidth
                        size='lg'
                        variant='bordered'
                        labelPlacement='outside'
                        {...register('class')}
                        isInvalid={errors.class ? true : false}
                        errorMessage={errors.class?.message}
                      >
                        {classGrade.map(item => (
                          <SelectItem key={item.uid} value={item.uid}>
                            {item.value}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        defaultSelectedKeys={
                          student?.gender ? [student?.gender] : []
                        }
                        label='Jenis Kelamin'
                        placeholder='Pilih jenis kelamin'
                        fullWidth
                        size='lg'
                        variant='bordered'
                        labelPlacement='outside'
                        {...register('gender')}
                        isInvalid={errors.gender ? true : false}
                        errorMessage={errors.gender?.message}
                      >
                        {gender.map(item => (
                          <SelectItem key={item.uid} value={item.uid}>
                            {item.value}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className='flex flex-row box-border gap-8 flex-wrap lg:flex-nowrap'>
                      <Controller
                        name='address'
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            label='Alamat'
                            variant='bordered'
                            placeholder='Inputkan alamat'
                            labelPlacement='outside'
                            type='address'
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className='flex flex-row box-border gap-8 flex-wrap lg:flex-nowrap'>
                      <Controller
                        name='nameParent'
                        control={control}
                        render={({ field }) => (
                          <Input
                            label='Nama Orangtua/Wali'
                            variant='bordered'
                            fullWidth
                            isClearable
                            size='lg'
                            {...field}
                            labelPlacement='outside'
                            placeholder='Inputkan nama orangtua/wali'
                            isInvalid={errors.nameParent ? true : false}
                            errorMessage={errors.nameParent?.message}
                          />
                        )}
                      />
                      <Controller
                        name='phoneNumberParent'
                        control={control}
                        render={({ field }) => (
                          <Input
                            label='No Hp Orangtua/Wali'
                            variant='bordered'
                            fullWidth
                            isClearable
                            labelPlacement='outside'
                            size='lg'
                            startContent={
                              <div className='pointer-events-none flex items-center'>
                                <span className='text-default-400 text-small'>
                                  +62
                                </span>
                              </div>
                            }
                            type='tel'
                            pattern='\d*'
                            maxLength={12}
                            {...field}
                            placeholder='Inputkan No HP orangtua/wali'
                            isInvalid={errors.phoneNumberParent ? true : false}
                            errorMessage={errors.phoneNumberParent?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                </form>
              </ModalBody>
              <Divider />
              <ModalFooter>
                <Button
                  form='form-student'
                  color='primary'
                  variant='shadow'
                  type='submit'
                  onPress={() => {
                    if (isValid) {
                      onClose()
                    }
                  }}
                >
                  {student ? 'Ubah' : 'Tambah'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default StudentForm

