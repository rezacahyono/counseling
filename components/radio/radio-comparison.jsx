import React from 'react'
import { Radio, cn } from '@nextui-org/react'

const RadioComparison = props => {
  const { children, ...otherProps } = props

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          'm-0 bg-default-200 hover:bg-default-300 items-center justify-center',
          'cursor-pointer rounded-lg border-2 border-transparent',
          'data-[selected=true]:bg-secondary'
        ),
        labelWrapper: cn('p-0 m-0 data-[selected=true]:text-default-500'),
        wrapper: cn('hidden'),
        label: cn('data-[selected=true]:text-default-500'),
      }}
    >
      {children}
    </Radio>
  )
}
export default RadioComparison

