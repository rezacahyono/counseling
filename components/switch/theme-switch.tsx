'use client'
import { IoMdSunny, IoMdMoon } from 'react-icons/io'
import { useTheme } from 'next-themes'
import React from 'react'
import { SwitchProps, VisuallyHidden, useSwitch } from '@nextui-org/react'

const ThemeSwitch = () => {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const [selected, setSelected] = React.useState(theme === 'dark')

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Switch
      defaultSelected
      size='lg'
      isSelected={selected}
      color='default'
      onValueChange={value => {
        setTheme(value ? 'dark' : 'light')
        setSelected(value)
      }}
    />
  )
}

const Switch = (props: SwitchProps) => {
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch(props)

  return (
    <div className='flex flex-col gap-2'>
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: [
              'w-8 h-8',
              'flex items-center justify-center',
              'rounded-lg bg-default-200 hover:bg-default-400',
            ],
          })}
        >
          {isSelected ? <IoMdSunny /> : <IoMdMoon />}
        </div>
      </Component>
    </div>
  )
}

export default ThemeSwitch

