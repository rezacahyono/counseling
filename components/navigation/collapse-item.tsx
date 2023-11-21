import { Accordion, AccordionItem } from '@nextui-org/react'
import classNames from 'classnames'
import { IoIosArrowDown } from 'react-icons/io'
import { usePathname } from 'next/navigation'
import React from 'react'
import SidebarItem from './sidebar-item'

type Props = {
  title: string
  icon: React.ReactNode
  items: ItemMenu[]
}

type ItemMenu = {
  label: string
  href: string
  icon: React.ReactNode
}

export default function CollapseItem({ title, icon, items }: Props) {
  const pathName = usePathname()
  const activePath = items.find(item => pathName.includes(item.href))

  const itemClassesAccordion = {
    base: 'py-0 w-full',
    title: `font-normal text-medium ${
      activePath ? 'text-zinc-50' : 'hover:text-default-800 text-default-600'
    }`,
    trigger: `${
      activePath
        ? 'bg-primary text-zinc-50 shadow-md shadow-primary'
        : 'hover:bg-default-200 hover:text-default-800 text-default-600'
    } px-4 gap-4 rounded-xl flex items-center h-11`,
    content: 'text-small',
  }

  return (
    <Accordion
      isCompact
      showDivider={false}
      className='flex flex-col w-full max-w-[300px] px-0'
      variant='light'
      itemClasses={itemClassesAccordion}
    >
      <AccordionItem
        key='1'
        indicator={
          <IoIosArrowDown
            className={classNames({
              'fill-zinc-100': activePath,
              'hover:fill-zinc-700 fill-zinc-500': !activePath,
            })}
          />
        }
        aria-label='collapse criteria'
        startContent={icon}
        title={title}
      >
        <div className='flex flex-col space-y-3 pl-3 pr-1 pt-1 pb-1'>
          {items.map((item, index) => (
            <SidebarItem
              key={item.href}
              title={item.label}
              href={item.href}
              isActive={pathName.includes(item.href)}
              icon={item.icon}
            />
          ))}
        </div>
      </AccordionItem>
    </Accordion>
  )
}

