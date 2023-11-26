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

export const isConsistencyRatioIndex = (value: number) => {
  if (value <= 0.1) {
    return 'Konsisten'
  } else {
    return 'Tidak Konsisten'
  }
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/
  return base64Regex.test(imageData)
}
