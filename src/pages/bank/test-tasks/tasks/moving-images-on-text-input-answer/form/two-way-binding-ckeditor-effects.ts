/*
 * legacy
 * Тут лежит двусторонняя привязка ckeditor и модели для
 * "Заданий с перемещением текста и картинок в текст"
 * */

import { createEffect } from 'effector-root'
import {
  MovingOnTextDroppableImage,
  MovingOnTextDroppableInput,
} from '@/pages/bank/test-tasks/tasks/types'
import {
  inputsCounter,
  textInputsCounter,
  droppableImagesCounter,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-text-input-answer/form/moving-images-on-text-input-answer-form.model'

export type InputTemplateFxType = {
  template: string
  oldTemplate: string
  droppableImages: MovingOnTextDroppableImage[]
  inputs: MovingOnTextDroppableInput[]
}

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
    const placeholder = input.getAttribute('placeholder')
    // уже есть в новом массиве
    const newInputsIndex = newInputs.findIndex((item) => item.systemIndex === placeholder)
    if (newInputsIndex !== -1) {
      const copy = JSON.parse(JSON.stringify(newInputs[newInputsIndex]))
      const systemIndex = inputsCounter.next()
      newInputs.push({
        ...copy,
        systemIndex,
      })
      input.setAttribute('placeholder', systemIndex)
      return
    }
    // есть в прошлом массиве
    const oldInputsIndex = data.inputs.findIndex((item) => item.systemIndex === placeholder)
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
          systemIndex: textInputsCounter.next(),
        },
      ],
      systemIndex: placeholder || '',
      color: '#000',
    })
  })

  const htmlImages = container.querySelectorAll<HTMLInputElement>('.redactor-drop')
  const newImages: MovingOnTextDroppableImage[] = []
  htmlImages.forEach((image) => {
    const placeholder = image.getAttribute('placeholder')
    // уже есть в новом массиве
    const newImagesIndex = newImages.findIndex((item) => item.systemIndex === placeholder)
    if (newImagesIndex !== -1) {
      const copy = JSON.parse(JSON.stringify(newImages[newImagesIndex]))
      const systemIndex = droppableImagesCounter.next()
      newImages.push({
        ...copy,
        value: systemIndex,
        systemIndex,
      })
      image.setAttribute('placeholder', systemIndex)
      return
    }
    // есть в прошлом массиве
    const oldImagesIndex = data.droppableImages.findIndex(
      (item) => item.systemIndex === placeholder
    )
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
      value: placeholder || '',
      systemIndex: placeholder || '',
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
    const placeholder = htmlInput.getAttribute('placeholder')
    const input = data.inputs.find((item) => item.systemIndex === placeholder)
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
    const placeholder = htmlImage.getAttribute('placeholder')
    const image = data.droppableImages.find((item) => item.systemIndex === placeholder)
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
