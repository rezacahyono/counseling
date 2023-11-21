'use client'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import React from 'react'
import { BiSolidTrash } from 'react-icons/bi'

type Props = {
  message: string
  model: string
  id?: string
  ids?: string[]
  path: string
  action: () => void
}
export default function ButtonDelete({
  message,
  model,
  id,
  ids,
  path,
  action,
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const handleDeleteAction = async () => {
    let res
    switch (model) {
      case 'criteria':
        const deleteCriteriaById = (
          await import('@/lib/actions/criteria.action')
        ).deleteCriteriaById
        res = deleteCriteriaById({ id, ids, path })
        break
      case 'subcriteria':
        const deleteSubcriteriaById = (
          await import('@/lib/actions/subcriteria.action')
        ).deleteSubcriteriaById
        res = deleteSubcriteriaById({ id, ids, path })
        break
      case 'student':
        const deleteStudentById = (await import('@/lib/actions/student.action'))
          .deleteStudentById
        res = deleteStudentById({ id, ids, path })
        break
      case 'actionSchool':
        const deleteActionSchoolById = (
          await import('@/lib/actions/action-school.action')
        ).deleteActionSchoolById
        res = deleteActionSchoolById({ id, ids, path })
      default:
        res = Promise.resolve()
        break
    }
    const toast = (await import('react-hot-toast')).default
    toast.promise(res, {
      loading: 'Menghapus...',
      success: <b>Data berhasil dihapus!...</b>,
      error: <b>Data gagal dihapus!.</b>,
    })
  }
  return (
    <>
      {ids ? (
        <Tooltip color='danger' content={`Hapus ${message}`}>
          <Button
            color='danger'
            variant='shadow'
            size='sm'
            startContent={<BiSolidTrash />}
            onClick={onOpen}
          >
            Hapus Semua
          </Button>
        </Tooltip>
      ) : (
        <Tooltip color='danger' content={`Hapus ${message}`}>
          <span
            className='text-lg text-danger cursor-pointer active:opacity-50'
            onClick={onOpen}
          >
            <BiSolidTrash />
          </span>
        </Tooltip>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='center'
        isDismissable={false}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>{`Hapus ${message}`}</ModalHeader>

              <ModalBody>
                <p className='text-medium font-medium text-default-700'>
                  {`Kamu yakin menghapus data ${message}`}
                </p>
                <p>
                  Data yang sudah dihapus tidak akan bisa dikembalikan lagi.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color='primary' variant='ghost' onPress={onClose}>
                  Batal
                </Button>
                <Button
                  color='danger'
                  variant='shadow'
                  onPress={onClose}
                  onClick={() => {
                    handleDeleteAction()
                    action()
                  }}
                >
                  Hapus
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

