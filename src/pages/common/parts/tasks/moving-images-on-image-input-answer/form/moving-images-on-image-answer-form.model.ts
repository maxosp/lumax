import {
  attach,
  combine,
  createEffect,
  createEvent,
  forward,
  merge,
  restore,
  sample,
  split,
} from 'effector-root'
import {
  DraggableImage,
  DraggableText,
  DroppableImage,
  DroppableInput,
  Position,
  Size,
} from '@/pages/common/parts/tasks/types'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { FilePickerEvent } from '@/ui/file-picker/types'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import {
  createAddEventForArrayStore,
  createRemoveEventForArrayStore,
  createReplaceEventForArrayStore,
  somePending,
} from '@/lib/effector/utils'
import {
  createCounter,
  getMaxByProp,
} from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/utils'
import {
  MovingOnImageInput,
  MovingOnImageQuestionData,
} from '@/pages/common/parts/tasks/moving-images-on-text-input-answer/form/types'

export const clearFields = createEvent<void>()

export const draggableImagesCounter = createCounter()
const inputsCounter = createCounter()
export const inputsValuesCounter = createCounter()
export const droppableImagesCounter = createCounter()
export const draggableTextCounter = createCounter()
export const resetCounters = createEvent<void>()

export const setupMovingOnImageAnswerDataFx = createEffect((data: MovingOnImageQuestionData) => {
  if (data.draggable) draggableImagesCounter.set(getMaxByProp(data.draggable, 'id'))
  if (data.droppable) droppableImagesCounter.set(getMaxByProp(data.droppable, 'id'))
  if (data['draggable-text']) draggableTextCounter.set(getMaxByProp(data['draggable-text'], 'id'))

  if (data.inputs) {
    inputsCounter.set(getMaxByProp(data.inputs, 'id'))
    const inputsValues = data.inputs.reduce<MovingOnImageInput['value']>((acc, input) => {
      return [...acc, ...input.value]
    }, [])
    inputsValuesCounter.set(getMaxByProp(inputsValues, 'id'))
  }

  return data
})

setupMovingOnImageAnswerDataFx.watch(() => clearFields())

resetCounters.watch(() => {
  inputsValuesCounter.reset()
  inputsCounter.reset()
  droppableImagesCounter.reset()
  draggableImagesCounter.reset()
  draggableTextCounter.reset()
})

const uploadMainImageFx = attach({
  effect: uploadMediaFx,
})

const getRealMainImageSizesFx = createEffect<string, Size>({
  handler: (src) =>
    new Promise<Size>((res, rej) => {
      const mainImage = new Image()
      mainImage.onload = () => {
        const maxImageWidth = 900
        const scale = mainImage.width > maxImageWidth ? maxImageWidth / mainImage.width : 1

        res({
          width: mainImage.width * scale,
          height: mainImage.height * scale,
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
export const setInputs = createEvent<DroppableInput[]>()
export const $inputs = restore(setInputs, [])
  .on(setupMovingOnImageAnswerDataFx.doneData, (_, question) => question.inputs)
  .reset(clearFields)
export const addInput = createAddEventForArrayStore($inputs, () => ({
  size: {
    width: 0,
    height: 0,
  },
  color: '#000',
  value: [
    {
      value: '',
      id: inputsValuesCounter.next(),
    },
  ],
  id: inputsCounter.next(),
  position: {
    x: 0,
    y: 0,
  },
}))
export const removeInput = createRemoveEventForArrayStore($inputs, 'id')
export const replaceInput = createReplaceEventForArrayStore($inputs, 'id')

export const setDraggableImages = createEvent<DraggableImage[]>()
export const $draggableImages = restore(setDraggableImages, [])
  .on(setupMovingOnImageAnswerDataFx.doneData, (_, question) => question.draggable)
  .on(uploadMediaImageFx.doneData, (items, res) => {
    return [
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
    ]
  })
  .reset(clearFields)
export const replaceDraggableImage = createReplaceEventForArrayStore($draggableImages, 'id')

export const removeDraggableImage = createRemoveEventForArrayStore($draggableImages, 'id')

export const uploadDraggableImage = createEvent<FileList>()

function changeSize(image: DraggableImage, item: DraggableImage) {
  if (item.value === image.value) {
    if (item.id === image.id) {
      return item.size
    }
    return { width: 0, height: 0 }
  }
  return image.size
}

sample({
  source: $draggableImages,
  clock: replaceDraggableImage,
  fn: (images, item) =>
    images.map((image) => {
      return {
        ...image,
        value: image.id !== item.id && item.value === image.value ? 0 : image.value,
        size: changeSize(image, item),
      }
    }),
  target: setDraggableImages,
})

forward({
  from: uploadDraggableImage,
  to: uploadDraggableImageFx,
})

export const setDroppableImages = createEvent<DroppableImage[]>()
export const $droppableImages = restore(setDroppableImages, [])
  .on(setupMovingOnImageAnswerDataFx.doneData, (_, question) => question.droppable)
  .reset(clearFields)

export const replaceDroppableImage = createReplaceEventForArrayStore($droppableImages, 'id')
export const removeDroppableImage = createRemoveEventForArrayStore($droppableImages, 'id')
export const addDroppableImage = createAddEventForArrayStore($droppableImages, () => {
  const id = droppableImagesCounter.next()
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
    value: id,
    id,
    position: {
      x: 0,
      y: 0,
    },
  }
})

$draggableImages.on(removeDroppableImage, (draggableImage, droppable) => {
  return draggableImage.map((draggable) => ({
    ...draggable,
    value: droppable.value === draggable.value ? 0 : draggable.value,
  }))
})

export const removeMainImage = createEvent<void>()
export const setMainImage = createEvent<string | null>()
export const $mainImage = restore(setMainImage, '')
  .on(setupMovingOnImageAnswerDataFx.doneData, (_, payload) => payload.mainImage)
  .reset(clearFields)

export const setMainImageSize = createEvent<Size | null>()
export const $mainImageSize = restore(setMainImageSize, null)
  .on(setupMovingOnImageAnswerDataFx.doneData, (_, payload) => payload.size)
  .reset(clearFields)

export const setDraggableText = createEvent<DraggableText[]>()
export const $draggableText = restore(setDraggableText, [])
  .on(setupMovingOnImageAnswerDataFx.doneData, (_, question) => question['draggable-text'])
  .reset(clearFields)

export const replaceDraggableText = createReplaceEventForArrayStore($draggableText, 'id')
export const removeDraggableText = createRemoveEventForArrayStore($draggableText, 'id')
export const addDraggableText = createAddEventForArrayStore($draggableText, () => ({
  text: '',
  id: draggableTextCounter.next(),
}))

forward({
  from: removeMainImage,
  to: clearFields,
})

export const uploadMainImage = createEvent<FilePickerEvent>()

// form-states

export type NextResizer = 'image' | 'text'

export const setNextResizableBlockType = createEvent<NextResizer | null>()
export const $nextResizableBlockType = restore(setNextResizableBlockType, null)

export const $canCreateResizableBlock = $nextResizableBlockType.map((type) => type !== null)

type Sizes = { position: Position; size: Size }

export const createResizableBlock = createEvent<Sizes>()

// noinspection JSVoidFunctionReturnValueUsed
export const createResizableBlockSplit = split({
  source: createResizableBlock,
  match: {
    image: $nextResizableBlockType.map((type) => type === 'image'),
    text: $nextResizableBlockType.map((type) => type === 'text'),
  },
  cases: {
    image: addDroppableImage.prepend<Sizes>((payload) => payload),
    text: addInput.prepend<Sizes>((payload) => payload),
  },
})

addDroppableImage.watch(() => setNextResizableBlockType(null))
addInput.watch(() => setNextResizableBlockType(null))

export const setNextResizerToImage = createEvent()
export const setNextResizerToText = createEvent()

forward({
  from: setNextResizerToImage,
  to: [
    setNextResizableBlockType.prepend(() => 'image'),
    successToastEvent('Выделите область на картинке для создания изображения'),
  ],
})

forward({
  from: setNextResizerToText,
  to: [
    setNextResizableBlockType.prepend(() => 'text'),
    successToastEvent('Выделите область на картинке для создания текстового блока'),
  ],
})

export const $mainImageUploading = somePending([uploadMainImageFx, getRealMainImageSizesFx])

export const $hideDragAndDropControls = combine(
  $mainImageUploading,
  $mainImage,
  $mainImageSize,
  $containerWidth,
  $droppableImages,
  $draggableImages,
  $draggableText,
  $inputs,
  (
    mainImageUploading,
    mainImage,
    mainImageSize,
    containerWidth,
    droppableImages,
    draggableImages,
    droppableText,
    inputs
  ) =>
    (mainImageUploading || !mainImage || !mainImageSize || !containerWidth) &&
    !(droppableImages.length || draggableImages.length || droppableText.length || inputs.length)
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
      draggable: draggableImages,
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
