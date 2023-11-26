import { Input, InputProps } from '@nextui-org/react'
import React from 'react'

const InputForm = ({
  label,
  name,
  register,
  errors,
  type,
}: {
  label: any
  name: any
  register: any
  errors: any
  type: 'text' | 'password'
}) => {
  return (
    <>
      <Input
        label={label}
        fullWidth
        variant='bordered'
        {...register(name)}
        isInvalid={!!errors[name]}
        errorMessage={errors[name]?.message}
        size='sm'
        type={type}
      />
    </>
  )
}

export default InputForm

