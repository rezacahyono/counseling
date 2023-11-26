import { subcriteriaScheme } from '@/lib/validations/analytic'
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
import { Criteria, Subcriteria } from '@prisma/client'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BiSolidEdit } from 'react-icons/bi'
import { z } from 'zod'

type Props = {
  subcriteria?: Subcriteria
  criterias: Criteria[]
}

const SubcriteriaForm = ({ subcriteria, criterias }: Props) => {
  const pathname = usePathname()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof subcriteriaScheme>>({
    resolver: zodResolver(subcriteriaScheme),
    defaultValues: {
      name: subcriteria?.name || '',
      description: subcriteria?.description || '',
    },
  })

  const onSubmit = handleSubmit(async data => {
    const createNewSubcriteria = (
      await import('@/lib/actions/subcriteria.action')
    ).createNewSubcriteria
    const updateSubcriteriaById = (
      await import('@/lib/actions/subcriteria.action')
    ).updateSubcriteriaById
    const toast = (await import('react-hot-toast')).default
    let res = Promise.resolve()
    if (!subcriteria) {
      res = createNewSubcriteria(
        {
          poin: data.poin,
          criteriaId: data.criteriaId,
          name: data.name,
          description: data.description,
        },
        pathname
      )
    } else {
      res = updateSubcriteriaById(
        subcriteria.id,
        {
          poin: data.poin,
          criteriaId: data.criteriaId,
          name: data.name,
          description: data.description,
        },
        pathname
      )
    }
    toast.promise(res, {
      loading: 'Menyimpan...',
      success: <b>Subkriteria berhasil disimpan...</b>,
      error: <b>Subkriteria gagal disimpan!.</b>,
    })
    reset()
  })
  return (
    <>
      {subcriteria ? (
        <Tooltip content='Ubah subkriteria'>
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
          Tambah Subkriteria
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
                  {subcriteria ? 'Ubah Subkriteria' : 'Tambah Subkriteria'}
                </h4>
              </ModalHeader>
              <Divider />
              <ModalBody className='py-6'>
                <form id='form-subcriteria' onSubmit={onSubmit}>
                  <div className='flex flex-col box-border flex-wrap gap-8 lg:flex-nowrap lg:gap-6'>
                    <div className='flex flex-row box-border gap-6 flex-wrap lg:flex-nowrap'>
                      <Select
                        defaultSelectedKeys={
                          subcriteria?.criteriaId
                            ? [subcriteria?.criteriaId]
                            : []
                        }
                        autoFocus
                        label='Kriteria'
                        placeholder='Pilih kriteria'
                        fullWidth
                        size='lg'
                        variant='bordered'
                        labelPlacement='outside'
                        {...register('criteriaId')}
                        isInvalid={errors.criteriaId ? true : false}
                        errorMessage={errors.criteriaId?.message}
                      >
                        {criterias.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </Select>
                      <Input
                        defaultValue={subcriteria?.poin.toString()}
                        label='Poin'
                        variant='bordered'
                        fullWidth
                        type='number'
                        isClearable
                        size='lg'
                        labelPlacement='outside'
                        placeholder='Inputkan poin'
                        {...register('poin', {
                          valueAsNumber: true,
                        })}
                        isInvalid={errors.poin ? true : false}
                        errorMessage={errors.poin?.message}
                      />
                    </div>
                    <div className='flex flex-row box-border gap-8 flex-wrap lg:flex-nowrap'>
                      <Controller
                        name='name'
                        control={control}
                        render={({ field }) => (
                          <Input
                            label='Nama Subkriteria'
                            variant='bordered'
                            fullWidth
                            isClearable
                            size='lg'
                            labelPlacement='outside'
                            placeholder='Inputkan nama subkriteria'
                            {...field}
                            isInvalid={errors.name ? true : false}
                            errorMessage={errors.name?.message}
                          />
                        )}
                      />
                    </div>
                    <div className='flex flex-row box-border gap-8 flex-wrap lg:flex-nowrap'>
                      <Controller
                        name='description'
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            label='Deskripsi'
                            variant='bordered'
                            placeholder='Inputkan deskripsi'
                            labelPlacement='outside'
                            type='address'
                            {...field}
                            isInvalid={errors.description ? true : false}
                            errorMessage={errors.description?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  form='form-subcriteria'
                  color='primary'
                  variant='shadow'
                  type='submit'
                  onPress={() => {
                    if (isValid) {
                      onClose()
                    }
                  }}
                >
                  {subcriteria ? 'Ubah' : 'Tambah'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default SubcriteriaForm

