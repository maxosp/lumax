/*
 * legacy
 * Тут лежит двусторонняя привязка ckeditor и модели для
 * "Заданий с перемещением текста и картинок в текст"
 * */

import { createEffect } from 'effector-root'
import {
  MovingOnTextDroppableImage,
  MovingOnTextDroppableInput,
} from '@/pages/common/parts/tasks/types'
import {
  inputsCounter,
  inputValuesCounter,
  droppableImagesCounter,
} from '@/pages/common/parts/tasks/moving-images-on-text-input-answer/form/moving-images-on-text-input-answer-form.model'

export type InputTemplateFxType = {
  template: string
  oldTemplate: string
  droppableImages: MovingOnTextDroppableImage[]
  inputs: MovingOnTextDroppableInput[]
}

const getNumber = (str: any) => +str.replace(/^\D+/g, '') || 0

let checking = false

export const setMainTemplateFx = createEffect((data: InputTemplateFxType) => {
  if (data.oldTemplate === data.template || checking) {
    return Promise.reject()
  }
  checking = true

  const container: HTMLElement = document.createElement('DIV')
  container.innerHTML = data.template

  const htmlInputs = container.querySelectorAll<HTMLInputElement>('.redactor-input')
  const newInputs: MovingOnTextDroppableInput[] = []
  htmlInputs.forEach((input) => {
    const placeholder = getNumber(input.getAttribute('placeholder'))
    // уже есть в новом массиве
    const newInputsIndex = newInputs.findIndex((item) => item.id === placeholder)
    if (newInputsIndex !== -1) {
      const copy = JSON.parse(JSON.stringify(newInputs[newInputsIndex]))
      const id = inputsCounter.next()
      newInputs.push({
        ...copy,
        id,
      })
      input.setAttribute('placeholder', `B${id}`)
      return
    }
    // есть в прошлом массиве
    const oldInputsIndex = data.inputs.findIndex((item) => item.id === placeholder)
    if (oldInputsIndex !== -1) {
      newInputs.push(data.inputs[oldInputsIndex])
      return
    }
    newInputs.push({
      size: {
        width: 100,
        height: 20,
      },
      value: [
        {
          value: '',
          id: inputValuesCounter.next(),
        },
      ],
      id: placeholder,
      color: '#000',
    })
  })

  const htmlImages = container.querySelectorAll<HTMLInputElement>('.redactor-drop')
  const newImages: MovingOnTextDroppableImage[] = []
  htmlImages.forEach((image) => {
    const placeholder = getNumber(image.getAttribute('placeholder'))
    // уже есть в новом массиве
    const newImagesIndex = newImages.findIndex((item) => item.id === placeholder)
    if (newImagesIndex !== -1) {
      const copy = JSON.parse(JSON.stringify(newImages[newImagesIndex]))
      const id = droppableImagesCounter.next()
      newImages.push({
        ...copy,
        value: id,
        id,
      })
      image.setAttribute('placeholder', `A${id}`)
      return
    }
    // есть в прошлом массиве
    const oldImagesIndex = data.droppableImages.findIndex((item) => item.id === placeholder)
    if (oldImagesIndex !== -1) {
      newImages.push(data.droppableImages[oldImagesIndex])
      return
    }
    newImages.push({
      size: {
        width: 30,
        height: 30,
      },
      pin: {
        x: 0,
        y: 0,
      },
      value: placeholder,
      id: placeholder,
      color: '#000',
    })
  })

  checking = false
  const nextTemplate = container.innerHTML.split(`type="text">`).join(`type="text" />`)
  return {
    template: nextTemplate,
    inputs: newInputs,
    images: newImages,
  }
})

const setStyles = (element: HTMLElement, styles: any) => {
  Object.entries(styles).forEach(([key, style]) => {
    element.style[key] = style
  })
}

export const generateNewTemplateFx = createEffect((data: InputTemplateFxType) => {
  const container: HTMLElement = document.createElement('DIV')
  container.innerHTML = data.template

  const htmlInputs = container.querySelectorAll<HTMLInputElement>('.redactor-input')

  htmlInputs.forEach((htmlInput) => {
    const placeholder = getNumber(htmlInput.getAttribute('placeholder'))
    const input = data.inputs.find((item) => item.id === placeholder)
    if (input) {
      setStyles(htmlInput, {
        width: `${input.size.width}px`,
        height: `${input.size.height}px`,
        color: input.color,
      })
      return
    }
    htmlInput.remove()
  })

  const htmlImages = container.querySelectorAll<HTMLInputElement>('.redactor-drop')
  htmlImages.forEach((htmlImage) => {
    const placeholder = getNumber(htmlImage.getAttribute('placeholder'))
    const image = data.droppableImages.find((item) => item.id === placeholder)
    if (image) {
      setStyles(htmlImage, {
        width: `${image.size.width}px`,
        height: `${image.size.height}px`,
        color: image.color,
      })
      return
    }
    htmlImage.remove()
  })

  return container.innerHTML.split(`type="text">`).join(`type="text" />`)
})
