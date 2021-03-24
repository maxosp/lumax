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
import { createCounter } from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/utils'
import {
  DraggableImage,
  DraggableText,
  MovingOnTextDroppableImage,
  MovingOnTextDroppableInput,
} from '@/pages/bank/test-tasks/tasks/types'
import {
  createAddEventForArrayStore,
  createRemoveEventForArrayStore,
  createReplaceEventForArrayStore,
} from '@/lib/effector/utils'
import {
  generateNewTemplateFx,
  setMainTemplateFx,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-text-input-answer/form/two-way-binding-ckeditor-effects'
import { uploadMediaFx } from '@/features/api/media/upload-media'

const templateChanged = createEvent<string>()
export const $mainTemplate = restore(templateChanged, '')

export const changeMainTemplate = createEvent<string>()

export const inputsCounter = createCounter('B')
export const textInputsCounter = createCounter()
export const setInputs = createEvent<MovingOnTextDroppableInput[]>()
export const $inputs = restore(setInputs, [])
export const replaceInput = createReplaceEventForArrayStore($inputs, 'systemIndex')
export const removeInput = createRemoveEventForArrayStore($inputs, 'systemIndex')

export const droppableImagesCounter = createCounter('A')
export const setDroppableImages = createEvent<MovingOnTextDroppableImage[]>()
export const $droppableImages = restore(setDroppableImages, [])
export const replaceDroppableImage = createReplaceEventForArrayStore(
  $droppableImages,
  'systemIndex'
)
export const removeDroppableImage = createRemoveEventForArrayStore($droppableImages, 'systemIndex')

const draggableTextCounter = createCounter()
export const setDraggableText = createEvent<DraggableText[]>()
export const $draggableText = restore(setDraggableText, [])
export const replaceDraggableText = createReplaceEventForArrayStore($draggableText, 'systemIndex')
export const removeDraggableText = createRemoveEventForArrayStore($draggableText, 'systemIndex')
export const addDraggableText = createAddEventForArrayStore($draggableText, () => ({
  text: '',
  systemIndex: draggableTextCounter.next(),
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

const draggableImagesCounter = createCounter()
export const setDraggableImages = createEvent<DraggableImage[]>()
export const $draggableImages = restore(setDraggableImages, []).on(
  uploadMediaImageFx.doneData,
  (items, res) => [
    ...items,
    {
      size: {
        width: 0,
        height: 0,
      },
      value: '',
      image: res.body.file,
      systemIndex: draggableImagesCounter.next(),
    },
  ]
)
export const replaceDraggableImage = createReplaceEventForArrayStore(
  $draggableImages,
  'systemIndex'
)

export const uploadDraggableImage = createEvent<FileList>()

forward({
  from: uploadDraggableImage,
  to: uploadDraggableImageFx,
})

sample({
  source: $draggableImages,
  clock: replaceDraggableImage,
  fn: (images, item) =>
    images.map((image) => {
      return {
        ...image,
        value:
          image.systemIndex !== item.systemIndex && item.value === image.value ? '' : image.value,
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
        (droppableItem) => droppableItem.value === draggableItem.value
      )
      return {
        ...draggableItem,
        value: inDroppable ? inDroppable.value : '',
      }
    })
  },
  target: setDraggableImages,
})

export const removeDraggableImage = createRemoveEventForArrayStore($draggableImages, 'systemIndex')

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
    draggable: draggableImages.map((image) => {
      const droppableImage = droppableImages.find((dropable) => dropable.value === image.value)
      return {
        ...image,
        size: droppableImage ? droppableImage.size : image.size,
      }
    }),
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
