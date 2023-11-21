'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from '@nextui-org/react'
import React from 'react'

const rows = [
  {
    key: '1',
    name: 'Tony Reichert',
    role: 'CEO',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Zoey Lang',
    role: 'Technical Lead',
    status: 'Paused',
  },
  {
    key: '3',
    name: 'Jane Fisher',
    role: 'Senior Developer',
    status: 'Active',
  },
  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },

  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },

  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },

  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },

  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },

  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },

  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },

  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },

  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },

  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },
]

const columns = [
  {
    key: 'name',
    label: 'NAME',
  },
  {
    key: 'role',
    label: 'ROLE',
  },
  {
    key: 'status',
    label: 'STATUS',
  },
]

export default function TableHighestOffense() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['2']))
  return (
    <div className='w-full max-w-full px-3 mt-0 mb-6 md:mb-0 md:1/2 md:flex-none lg:w-2/3 lg:flex-none'>
      <Table
        aria-label='Controlled table example with dynamic content'
        selectionMode='multiple'
        classNames={{
          wrapper: 'max-h-80 rounded-xl shadow-soft-xl',
        }}
        isHeaderSticky
        shadow='none'
        selectedKeys={selectedKeys}
        onSelectionChange={keys => {
          setSelectedKeys(keys as Set<string>)
        }}
      >
        <TableHeader columns={columns}>
          {column => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
          {item => (
            <TableRow key={item.key}>
              {columnKey => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

