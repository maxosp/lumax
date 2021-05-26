import { Size } from '@/pages/common/parts/tasks/types'
import { BACKGROUND_IMAGE_SIZE } from '@/pages/common/constants'

export const getRandomId = (): number => Number.parseInt(`${Math.random() * 1000}`, 10)

export const getInputsIds = (arr: string[]) => {
  const idsString = arr.map((input) => input.match(/id="(\d+)"/g))
  return idsString.map((input) => input![0].match(/\d/g)![0])
}

export const getArraysDiff = (a1: Array<any>, a2: Array<any>) => {
  const a = []
  const diff = []

  for (let i = 0; i < a1.length; i++) {
    a[a1[i]] = true
  }

  for (let i = 0; i < a2.length; i++) {
    if (a[a2[i]]) {
      delete a[a2[i]]
    } else {
      a[a2[i]] = true
    }
  }

  // eslint-disable-next-line
  for (const k in a) {
    diff.push(k)
  }

  return diff
}

export const removeInputsFromEditor = (mainStr: string, id: number) => {
  let newTextTemplate = mainStr
  const inputsIds = getInputsIds(newTextTemplate.match(/<input(.*?)>/g)!).map((inputId) =>
    +inputId > id ? `${+inputId - 1}` : `${+inputId}`
  )
  const tempTemplate = newTextTemplate
    .match(/<input(.*?)>/g)!
    .map((input) => {
      if (+input.match(/id="(\d+)"/)![1] === id)
        input.replace(/placeholder="(.*?)"/, `placeholder="1"`)
      return input
    })
    .map((input, index) => input.replace(/id="(\d+)"/, `id="${inputsIds[index]}"`))
    .map((input, index) =>
      input.replace(/placeholder="S(\d+)"/, `placeholder="S${inputsIds[index]}"`)
    )
  newTextTemplate = newTextTemplate.replace(/<input(.*?)>/g, () => {
    const res = tempTemplate[0]
    tempTemplate.shift()
    return res
  })
  return newTextTemplate
}

export const getImageSize = (src: string) =>
  new Promise<{ src: string; size: Size }>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = img.width > BACKGROUND_IMAGE_SIZE ? BACKGROUND_IMAGE_SIZE / img.width : 1

      resolve({
        src,
        size: {
          width: img.width * scale,
          height: img.height * scale,
        },
      })
    }
    img.onerror = reject
    img.src = src
  })
