import { SliderStepMark } from '@nextui-org/react'

export const between = (value: number, min: number, max: number) => {
  return value >= min && value <= max
}

export const marksSlider = (max: number) => {
  const marks: SliderStepMark[] = []
  for (let i = 10; i < max; i += 10) {
    marks.push({
      value: i,
      label: i.toString(),
    })
  }
  return marks
}