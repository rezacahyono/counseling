'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div
      className='box overflow-scroll no-scrollbar'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {children}
    </motion.div>
  )
}

