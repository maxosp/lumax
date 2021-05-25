import {
  attach,
  combine,
  createEffect,
  createEvent,
  forward,
  merge,
  restore,
  sample,
} from 'effector-root'
import {
  createCounter,
  getMaxByProp,
} from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/utils'
import {
  DraggableImage,
  DraggableText,
  MovingOnTextDroppableImage,
  MovingOnTextDroppableInput,
  Size,
} from '@/pages/common/parts/tasks/types'
import {
  createAddEventForArrayStore,
  createRemoveEventForArrayStore,
  createReplaceEventForArrayStore,
} from '@/lib/effector/utils'
import {
  generateNewTemplateFx,
  setMainTemplateFx,
} from '@/pages/common/parts/tasks/moving-images-on-text-input-answer/form/two-way-binding-ckeditor-effects'
import { uploadMediaFx } from '@/features/api/media/upload-media'

import {
  MovingOnTextQuestionData,
  MovingOnTextInput,
} from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/form/types'
import { getImageSize } from '@/pages/common/parts/tasks/utils'

const draggableImagesCounter = createCounter()
const draggableTextCounter = createCounter()
export const inputsCounter = createCounter()
export const inputValuesCounter = createCounter()
export const droppableImagesCounter = createCounter()

export const clearFields = createEvent<void>()

export const setupMovingOnTextAnswerDataFx = createEffect((data: MovingOnTextQuestionData) => {
  if (data.draggable) draggableImagesCounter.set(getMaxByProp(data.draggable, 'id'))
  if (data.droppable) droppableImagesCounter.set(getMaxByProp(data.droppable, 'id'))
  if (data['draggable-text']) draggableTextCounter.set(getMaxByProp(data['draggable-text'], 'id'))

  if (data.inputs) {
    inputsCounter.set(getMaxByProp(data.inputs, 'id'))
    const inputsValues = data.inputs.reduce<MovingOnTextInput['value']>((acc, input) => {
      return [...acc, ...input.value]
    }, [])
    inputValuesCounter.set(getMaxByProp(inputsValues, 'id'))
  }
  return data
})

setupMovingOnTextAnswerDataFx.watch(() => clearFields)

const templateChanged = createEvent<string>()
export const $mainTemplate = restore(templateChanged, '')
  .on(setupMovingOnTextAnswerDataFx.doneData, (_, payload) => payload.mainText)
  .reset(clearFields)

export const changeMainTemplate = createEvent<string>()

export const setInputs = createEvent<MovingOnTextDroppableInput[]>()
export const $inputs = restore(setInputs, [])
  .on(setupMovingOnTextAnswerDataFx.doneData, (_, payload) => payload.inputs)
  .reset(clearFields)
export const replaceInput = createReplaceEventForArrayStore($inputs, 'id')
export const removeInput = createRemoveEventForArrayStore($inputs, 'id')

export const setDroppableImages = createEvent<MovingOnTextDroppableImage[]>()
export const $droppableImages = restore(setDroppableImages, [])
  .on(setupMovingOnTextAnswerDataFx.doneData, (_, payload) => payload.droppable)
  .reset(clearFields)
export const replaceDroppableImage = createReplaceEventForArrayStore($droppableImages, 'id')
export const removeDroppableImage = createRemoveEventForArrayStore($droppableImages, 'id')

export const setDraggableText = createEvent<DraggableText[]>()
export const $draggableText = restore(setDraggableText, [])
  .on(setupMovingOnTextAnswerDataFx.doneData, (_, payload) => payload['draggable-text'])
  .reset(clearFields)
export const replaceDraggableText = createReplaceEventForArrayStore($draggableText, 'id')
export const removeDraggableText = createRemoveEventForArrayStore($draggableText, 'id')
export const addDraggableText = createAddEventForArrayStore($draggableText, () => ({
  text: '',
  id: draggableTextCounter.next(),
}))

$inputs.on(setMainTemplateFx.doneData, (_, payload) => payload.inputs)
$mainTemplate.on(setMainTemplateFx.doneData, (_, payload) => payload.template)
$droppableImages.on(setMainTemplateFx.doneData, (_, payload) => payload.images)

const uploadMediaImageFx = attach({
  effect: uploadMediaFx,
})

const uploadDraggableImageFx = createEffect<FileList, void>({
  handler: (files) => {
    Array.from(files).forEach((file) => {
      const data = new FormData()
      data.append('file', file)
      data.append('file_type', 'img')
      uploadMediaImageFx(data)
    })
  },
})

const getDraggableImageSizesFx = createEffect<string, { src: string; size: Size }>({
  handler: getImageSize,
})

export const setDraggableImages = createEvent<DraggableImage[]>()
export const $draggableImages = restore(setDraggableImages, [])
  .on(setupMovingOnTextAnswerDataFx.doneData, (_, payload) => payload.draggable)
  .on(uploadMediaImageFx.doneData, (items, res) => [
    ...items,
    {
      size: {
        width: 0,
        height: 0,
      },
      value: 0,
      image: res.body.file,
      id: draggableImagesCounter.next(),
    },
  ])
  .reset(clearFields)
export const replaceDraggableImage = createReplaceEventForArrayStore($draggableImages, 'id')

export const uploadDraggableImage = createEvent<FileList>()

forward({
  from: uploadDraggableImage,
  to: uploadDraggableImageFx,
})

forward({
  from: uploadMediaImageFx.doneData.map((res) => res.body.file),
  to: getDraggableImageSizesFx,
})

sample({
  source: $draggableImages,
  clock: getDraggableImageSizesFx.doneData,
  fn: (images, params) => {
    const newImage = images.find((image) => image.image === params.src)
    if (newImage) {
      newImage.size = params.size
    }
    return [...images]
  },
  target: setDraggableImages,
})

sample({
  source: $draggableImages,
  clock: replaceDraggableImage,
  fn: (images, item) =>
    images.map((image) => {
      return {
        ...image,
        value: image.id !== item.id && item.value === image.value ? 0 : image.value,
      }
    }),
  target: setDraggableImages,
})

sample({
  source: $draggableImages,
  clock: $droppableImages,
  fn: (draggable, droppable) => {
    return draggable.map((draggableItem) => {
      const inDroppable = droppable.find(
        (droppableItem) => +droppableItem.value === +draggableItem.value
      )
      return {
        ...draggableItem,
        value: inDroppable ? inDroppable.value : 0,
      }
    })
  },
  target: setDraggableImages,
})

export const removeDraggableImage = createRemoveEventForArrayStore($draggableImages, 'id')

sample({
  source: combine({
    inputs: $inputs,
    oldTemplate: $mainTemplate,
    droppableImages: $droppableImages,
  }),
  clock: changeMainTemplate,
  fn: (source, template) => ({
    ...source,
    template,
  }),
  target: setMainTemplateFx,
})

forward({
  from: generateNewTemplateFx.doneData,
  to: changeMainTemplate,
})

sample({
  source: combine({
    inputs: $inputs,
    oldTemplate: $mainTemplate,
    template: $mainTemplate,
    droppableImages: $droppableImages,
  }),
  clock: merge([replaceInput, removeInput, removeDroppableImage, replaceDroppableImage]),
  fn: (payload) => payload,
  target: generateNewTemplateFx,
})

export const $questionData = combine(
  $mainTemplate,
  $inputs,
  $draggableText,
  $droppableImages,
  $draggableImages,
  (mainTemplate, inputs, draggableText, droppableImages, draggableImages) => ({
    draggable: draggableImages,
    mainText: mainTemplate,
    droppable: droppableImages.map((image) => ({
      ...image,
      pin: {
        x: image.size.width / 2,
        y: image.size.height / 2,
      },
    })),
    'draggable-text': draggableText,
    inputs,
  })
)
