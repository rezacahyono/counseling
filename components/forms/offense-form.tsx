import { offenseScheme } from '@/lib/validations/analytic'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import { Criteria, Offense, Student, Subcriteria } from '@prisma/client'
import { CustomFlowbiteTheme, Datepicker } from 'flowbite-react'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BiSolidEdit } from 'react-icons/bi'
import { z } from 'zod'

type Props = {
  offense?: {
    student: Student
    criteria: Criteria
    subcriteria: Subcriteria
  } & Offense
  students: Student[]
  criterias: ({
    subcriteria: Subcriteria[]
  } & Criteria)[]
}

const dateTheme: CustomFlowbiteTheme['datepicker'] = {
  popup: {
    footer: {
      button: {
        base: 'w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-primary',
        today: 'bg-primary text-white',
        clear:
          'border border-default-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
      },
    },
  },
  views: {
    days: {
      items: {
        item: {
          selected: 'bg-primary text-white hover:bg-primary',
        },
      },
    },
  },
}

export default function OffenseForm({ offense, students, criterias }: Props) {
  const pathname = usePathname()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [criteriaId, setCriteriaId] = React.useState<React.Key>(
    offense?.criteriaId ?? ''
  )

  const filteredCriteria = React.useMemo(() => {
    let items: ({
      subcriteria: Subcriteria[]
    } & Criteria)[] = []
    if (criteriaId !== '') {
      items = [...criterias]
      items = items.filter(item => item.id === criteriaId)
    } else {
      items = []
    }
    return items
  }, [criteriaId, criterias])

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof offenseScheme>>({
    resolver: zodResolver(offenseScheme),
    defaultValues: {
      date: offense?.date || undefined,
      studentId: offense?.studentId || '',
      criteriaId: offense?.criteriaId || '',
      subcriteriaId: offense?.subcriteriaId || '',
      description: offense?.description || '',
    },
  })

  const onSubmit = handleSubmit(async data => {
    const createNewOffense = (await import('@/lib/actions/offense.action'))
      .createNewOffense
    const updateOffenseById = (await import('@/lib/actions/offense.action'))
      .updateOffenseById
    const toast = (await import('react-hot-toast')).default
    let res = Promise.resolve()
    if (!offense) {
      res = createNewOffense(
        {
          date: new Date(data.date),
          studentId: data.studentId,
          criteriaId: data.criteriaId,
          subcriteriaId: data.subcriteriaId,
          description: data.description,
        },
        pathname
      )
    } else {
      res = updateOffenseById(
        offense.id,
        {
          date: new Date(data.date),
          studentId: data.studentId,
          criteriaId: data.criteriaId,
          subcriteriaId: data.subcriteriaId,
          description: data.description,
        },
        pathname
      )
    }
    toast.promise(res, {
      loading: 'Menyimpan...',
      success: <b>Data pelanggaran berhasil disimpan...</b>,
      error: <b>Data pelanggaran gagal disimpan!.</b>,
    })
    reset()
  })

  return (
    <>
      {offense ? (
        <Tooltip content='Ubah pelanggaran'>
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
          Tambah Pelanggaran
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
                  {offense ? 'Ubah Pelanggaran' : 'Tambah Pelanggaran'}
                </h4>
              </ModalHeader>
              <Divider />
              <ModalBody className='py-10'>
                <form id='form-offense' onSubmit={onSubmit}>
                  <div className='flex flex-col box-border flex-wrap gap-8 lg:flex-nowrap lg:gap-6'>
                    <div className='flex flex-row box-border gap-6 flex-wrap lg:flex-nowrap items-center'>
                      <div className='flex flex-col gap-1.5 w-full items-start'>
                        <p className='text-sm'>Tanggal</p>
                        <Controller
                          name='date'
                          control={control}
                          render={({ field }) => (
                            <Datepicker
                              className='w-full'
                              theme={dateTheme}
                              value={
                                field?.value ? field.value.toDateString() : ''
                              }
                              onSelectedDateChanged={date => {
                                field.onChange(new Date(date))
                              }}
                            />
                          )}
                        />
                      </div>
                      <Controller
                        name='studentId'
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            items={students}
                            label='Nama Siswa'
                            placeholder='Pilih nama siswa'
                            fullWidth
                            variant='bordered'
                            labelPlacement='outside'
                            selectedKey={field.value}
                            onSelectionChange={value => field.onChange(value)}
                            isInvalid={errors.studentId ? true : false}
                            errorMessage={errors.studentId?.message}
                          >
                            {item => (
                              <AutocompleteItem key={item.id} value={item.id}>
                                {item.name}
                              </AutocompleteItem>
                            )}
                          </Autocomplete>
                        )}
                      />
                    </div>
                    <div className='flex flex-row box-border gap-6 flex-wrap lg:flex-nowrap'>
                      <Controller
                        name='criteriaId'
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            label='Kriteria'
                            placeholder='Pilih kriteria'
                            fullWidth
                            variant='bordered'
                            labelPlacement='outside'
                            isInvalid={errors.criteriaId ? true : false}
                            errorMessage={errors.criteriaId?.message}
                            selectedKey={field.value}
                            onSelectionChange={value => {
                              setCriteriaId(value)
                              field.onChange(value)
                            }}
                          >
                            {criterias.map(item => (
                              <AutocompleteItem key={item.id} value={item.id}>
                                {item.name}
                              </AutocompleteItem>
                            ))}
                          </Autocomplete>
                        )}
                      />
                    </div>
                    <div className='flex flex-row box-border gap-6 flex-wrap lg:flex-nowrap'>
                      <Controller
                        name='subcriteriaId'
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            label='Pelanggaran'
                            placeholder='Pilih pelanggaran'
                            fullWidth
                            variant='bordered'
                            labelPlacement='outside'
                            selectedKey={field.value}
                            onSelectionChange={value => {
                              field.onChange(value)
                            }}
                            isInvalid={errors.subcriteriaId ? true : false}
                            errorMessage={errors.subcriteriaId?.message}
                          >
                            {filteredCriteria[0]?.subcriteria?.map(item => (
                              <AutocompleteItem key={item.id}>
                                {item.name}
                              </AutocompleteItem>
                            ))}
                          </Autocomplete>
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
                            type='text'
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
              <Divider />
              <ModalFooter>
                <Button
                  form='form-offense'
                  color='primary'
                  onPress={() => {
                    if (isValid) {
                      onClose()
                    }
                  }}
                  type='submit'
                >
                  {offense ? 'Ubah' : 'Tambah'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

