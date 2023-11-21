import { between } from '@/utils/util'
import { ChipProps } from '@nextui-org/react'


export const poinColorMap = (poin: number) => {
  if (between(poin, 0, 25)) {
    return 'primary'
  } else if (between(poin, 26, 50)) {
    return 'secondary'
  } else if (between(poin, 51, 75)) {
    return 'warning'
  } else if (between(poin, 76, 100)) {
    return 'danger'
  } else {
    return 'danger'
  }
}

export const classColorMap: Record<string, ChipProps['color']> = {
  x: 'primary',
  xi: 'secondary',
  xii: 'warning',
}