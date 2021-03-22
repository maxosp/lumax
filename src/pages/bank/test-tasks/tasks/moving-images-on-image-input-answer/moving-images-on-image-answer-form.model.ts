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
  DraggableImage,
  DraggableText,
  DroppableImage,
  DroppableInput,
  Size,
} from '@/pages/bank/test-tasks/tasks/types'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { FilePickerEvent } from '@/ui/file-picker/types'
import { errorToastEvent } from '@/features/toasts/toasts.model'
import {
  createAddEventForArrayStore,
  createRemoveEventForArrayStore,
  createReplaceEventForArrayStore,
  somePending,
} from '@/lib/effector/utils'
import { createCounter } from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/utils'

const uploadMainImageFx = attach({
  effect: uploadMediaFx,
})

const getRealMainImageSizesFx = createEffect<string, Size>({
  handler: (src) =>
    new Promise<Size>((res, rej) => {
      const mainImage = new Image()
      mainImage.onload = () => {
        res({
          width: mainImage.width,
          height: mainImage.height,
        })
      }
      mainImage.onerror = rej
      mainImage.src = src
    }),
})

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

export const setContainerWidth = createEvent<number>()
export const $containerWidth = restore(setContainerWidth, 0)

// form-data
const inputsCounter = createCounter('B')
export const setInputs = createEvent<DroppableInput[]>()
export const $inputs = restore(setInputs, [])
export const addInput = createAddEventForArrayStore($inputs, () => ({
  size: {
    width: 0,
    height: 0,
  },
  color: '#000',
  value: '',
  systemIndex: inputsCounter.next(),
  position: {
    x: 0,
    y: 0,
  },
}))
export const removeInput = createRemoveEventForArrayStore($inputs, 'systemIndex')
export const replaceInput = createReplaceEventForArrayStore($inputs, 'systemIndex')

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

export const removeDraggableImage = createRemoveEventForArrayStore($draggableImages, 'systemIndex')

const droppableImagesCounter = createCounter('A')
export const uploadDraggableImage = createEvent<FileList>()

forward({
  from: uploadDraggableImage,
  to: uploadDraggableImageFx,
})

export const setDroppableImages = createEvent<DroppableImage[]>()
export const $droppableImages = restore(setDroppableImages, [])
export const replaceDroppableImage = createReplaceEventForArrayStore(
  $droppableImages,
  'systemIndex'
)
export const removeDroppableImage = createRemoveEventForArrayStore($droppableImages, 'systemIndex')
export const addDroppableImage = createAddEventForArrayStore($droppableImages, () => {
  const systemIndex = droppableImagesCounter.next()
  return {
    pin: {
      x: 0,
      y: 0,
    },
    size: {
      width: 0,
      height: 0,
    },
    color: '#000',
    value: systemIndex,
    systemIndex,
    position: {
      x: 0,
      y: 0,
    },
  }
})

export const setMainImage = createEvent<string | null>()
export const $mainImage = restore(setMainImage, '')

export const setMainImageSize = createEvent<Size | null>()
export const $mainImageSize = restore(setMainImageSize, null)

const draggableTextCounter = createCounter()
export const setDraggableText = createEvent<DraggableText[]>()
export const $draggableText = restore(setDraggableText, [])
export const replaceDraggableText = createReplaceEventForArrayStore($draggableText, 'systemIndex')
export const removeDraggableText = createRemoveEventForArrayStore($draggableText, 'systemIndex')
export const addDraggableText = createAddEventForArrayStore($draggableText, () => ({
  text: '',
  systemIndex: draggableTextCounter.next(),
}))

export const uploadMainImage = createEvent<FilePickerEvent>()

// form-states

export const $mainImageUploading = somePending([uploadMainImageFx, getRealMainImageSizesFx])

export const $hideDragAndDropControls = combine(
  $mainImageUploading,
  $mainImage,
  $mainImageSize,
  $containerWidth,
  (mainImageUploading, mainImage, mainImageSize, containerWidth) =>
    mainImageUploading || !mainImage || !mainImageSize || !containerWidth
)

export const $scale = combine($containerWidth, $mainImageSize, (containerWidth, mainImageSizes) => {
  if (!mainImageSizes || mainImageSizes.width <= containerWidth) {
    return 1
  }
  return containerWidth / mainImageSizes.width
})

forward({
  from: uploadMainImage.map((event) =>
    event.getFormData('file', {
      file_type: 'img',
    })
  ),
  to: [uploadMainImageFx, setMainImage.prepend(() => ''), setMainImageSize.prepend(() => null)],
})

forward({
  from: merge([uploadMainImageFx.failData, getRealMainImageSizesFx.failData]),
  to: errorToastEvent('Не удалось загрузить фоновое изображение'),
})

forward({
  from: uploadMainImageFx.doneData.map((res) => res.body.file),
  to: [getRealMainImageSizesFx, setMainImage],
})

forward({
  from: getRealMainImageSizesFx.doneData,
  to: setMainImageSize,
})

export const $questionData = combine(
  $draggableImages,
  $droppableImages,
  $mainImage,
  $mainImageSize,
  $draggableText,
  $inputs,
  (draggableImages, droppableImages, mainImage, mainImageSize, draggableText, inputs) => {
    return {
      draggable: draggableImages.map((image) => {
        const droppableImage = droppableImages.find((dropable) => dropable.value === image.value)
        return {
          ...image,
          size: droppableImage ? droppableImage.size : image.size,
        }
      }),
      droppable: droppableImages.map((image) => ({
        ...image,
        pin: {
          x: image.size.width / 2,
          y: image.size.height / 2,
        },
      })),
      mainImage,
      size: mainImageSize,
      'draggable-text': draggableText,
      inputs,
    }
  }
)
