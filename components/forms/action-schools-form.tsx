import { actionSchoolScheme } from '@/lib/validations/analytic'
import { marksSlider } from '@/utils/util'
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
  Slider,
  Textarea,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import { ActionSchool } from '@prisma/client'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BiSolidEdit } from 'react-icons/bi'
import { z } from 'zod'

type Props = {
  actionSchool?: ActionSchool
}

export default function ActionSchoolForm({ actionSchool }: Props) {
  const pathname = usePathname()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof actionSchoolScheme>>({
    resolver: zodResolver(actionSchoolScheme),
    defaultValues: {
      stack: actionSchool?.stack || '',
      action: actionSchool?.action || '',
      sanction: actionSchool?.sanction || '',
    },
  })

  const onSubmit = handleSubmit(async data => {
    const {createNewActionSchool} = (
      await import('@/lib/actions/action-school.action')
    )
    const {updateActionSchoolById} = (
      await import('@/lib/actions/action-school.action')
    )
    const toast = (await import('react-hot-toast')).default
    let res = Promise.resolve()
    if (!actionSchool) {
      res = createNewActionSchool(
        {
          poinStart: data.poinRange[0],
          poinEnd: data.poinRange[1],
          stack: data.stack,
          action: data.action,
          sanction: data.sanction,
        },
        pathname
      )
    } else {
      res = updateActionSchoolById(
        actionSchool.id,
        {
          poinStart: data.poinRange[0],
          poinEnd: data.poinRange[1],
          stack: data.stack,
          action: data.action,
          sanction: data.sanction,
        },
        pathname
      )
    }
    toast.promise(res, {
      loading: 'Menyimpan...',
      success: <b>Data tindakan berhasil disimpan...</b>,
      error: <b>Data tindakan gagal disimpan!.</b>,
    })
    reset()
  })

  return (
    <>
      {actionSchool ? (
        <Tooltip content='Ubah tindakan'>
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
          Tambah Tindakan
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
                  {actionSchool ? 'Ubah Tindakan' : 'Tambah Tindakan'}
                </h4>
              </ModalHeader>
              <Divider />
              <ModalBody className='py-6'>
                <form id='form-action-school' onSubmit={onSubmit}>
                  <div className='flex flex-col box-border flex-wrap gap-8 lg:flex-nowrap lg:gap-6'>
                    <div className='flex flex-row box-border gap-6 flex-wrap lg:flex-nowrap'>
                      <Controller
                        name='poinRange'
                        control={control}
                        defaultValue={
                          actionSchool
                            ? [actionSchool.poinStart, actionSchool.poinEnd]
                            : [0, 0]
                        }
                        render={({ field }) => (
                          <Slider
                            {...field}
                            label='Rentang Poin'
                            minValue={0}
                            maxValue={100}
                            size='lg'
                            marks={marksSlider(100)}
                            showTooltip={true}
                          />
                        )}
                      />
                      <Controller
                        name='stack'
                        control={control}
                        render={({ field }) => (
                          <Input
                            label='Tingkatan Stack'
                            variant='bordered'
                            fullWidth
                            isClearable
                            size='lg'
                            labelPlacement='outside'
                            placeholder='Inputkan tingkatan stack'
                            {...field}
                            isInvalid={!!errors.stack}
                            errorMessage={errors.stack?.message}
                          />
                        )}
                      />
                    </div>
                    <div className='flex flex-row box-border gap-8 flex-wrap lg:flex-nowrap'>
                      <Controller
                        name='action'
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            label='Tindakan'
                            variant='bordered'
                            placeholder='Inputkan tindakan'
                            labelPlacement='outside'
                            type='text'
                            {...field}
                            isInvalid={!!errors.action}
                            errorMessage={errors.action?.message}
                          />
                        )}
                      />
                    </div>
                    <div className='flex flex-row box-border gap-8 flex-wrap lg:flex-nowrap'>
                      <Controller
                        name='sanction'
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            label='Sanksi'
                            variant='bordered'
                            placeholder='Inputkan sanksi'
                            labelPlacement='outside'
                            type='text'
                            {...field}
                            isInvalid={!!errors.sanction}
                            errorMessage={errors.sanction?.message}
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
                  form='form-action-school'
                  color='primary'
                  variant='shadow'
                  type='submit'
                  onPress={() => {
                    if (isValid) {
                      onClose()
                    }
                  }}
                >
                  {actionSchool ? 'Ubah' : 'Tambah'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  ) 
}
