'use client'
import { criteriaScheme } from '@/lib/validations/analytic'
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
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import { Criteria } from '@prisma/client'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BiSolidEdit } from 'react-icons/bi'
import { z } from 'zod'

type Props = {
  criteria?: Criteria
}

const CriteriaForm = ({ criteria }: Props) => {
  const pathname = usePathname()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof criteriaScheme>>({
    resolver: zodResolver(criteriaScheme),
    defaultValues: {
      name: criteria?.name || '',
    },
  })

  const onSubmit = handleSubmit(async data => {
    const createNewCriteria = (await import('@/lib/actions/criteria.action'))
      .createNewCriteria
    const updateCriteriaById = (await import('@/lib/actions/criteria.action'))
      .updateCriteriaById
    const toast = (await import('react-hot-toast')).default
    let res = Promise.resolve()
    if (!criteria) {
      res = createNewCriteria({
        name: data.name,
        path: pathname,
      })
    } else {
      res = updateCriteriaById({
        id: criteria.id,
        name: data.name,
        path: pathname,
      })
    }
    toast.promise(res, {
      loading: 'Menyimpan...',
      success: <b>Kriteria berhasil disimpan...</b>,
      error: <b>Kriteria gagal disimpan!.</b>,
    })
    reset()
  })
  return (
    <>
      {criteria ? (
        <Tooltip content='Ubah kriteria'>
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
          Tambah Kriteria
        </Button>
      )}
      <Modal
        closeButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size='3xl'
        placement='center'
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>
                <h4 className='mb-2 mt-5 text-2xl font-medium leading-tight'>
                  {criteria ? 'Ubah Kriteria' : 'Tambah Kriteria'}
                </h4>
              </ModalHeader>
              <Divider />
              <ModalBody className='py-6'>
                <form id='form-criteria' onSubmit={onSubmit}>
                  <div className='flex flex-col box-border flex-wrap gap-8 lg:flex-nowrap lg:gap-6'>
                    <div className='flex flex-row box-border gap-6 flex-wrap lg:flex-nowrap'>
                      <Controller
                        name='name'
                        control={control}
                        render={({ field }) => (
                          <Input
                            label='Nama Kriteria'
                            variant='bordered'
                            fullWidth
                            isClearable
                            size='lg'
                            labelPlacement='outside'
                            placeholder='Inputkan nama kriteria'
                            {...field}
                            isInvalid={errors.name ? true : false}
                            errorMessage={errors.name?.message}
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
                  form='form-criteria'
                  color='primary'
                  variant='shadow'
                  type='submit'
                  onPress={() => {
                    if (isValid) {
                      onClose()
                    }
                  }}
                >
                  {criteria ? 'Ubah' : 'Tambah'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default CriteriaForm

