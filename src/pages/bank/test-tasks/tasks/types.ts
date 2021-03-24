import { UploadMediaResponse } from '@/features/api/media/types'
import { DropdownItem } from '@/pages/common/types'

export type AudioFile = {
  isLimited: boolean
  limit: number
} & UploadMediaResponse

export type ShortClosedAnswer = {
  id: number
  value: string
}

export type MultipleShortClosedAnswer = {
  mark?: string
} & ShortClosedAnswer

export type MultipleShortClosedQuestion = {
  id: number
  question: string
  answers: MultipleShortClosedAnswer[]
}

export type MultipleChoiceOneOrManyQuestion = {
  id: number
  question: string
  mark?: string
  isCorrect: boolean
}

export type CommonListStringQuestion = {
  id: number
  question: string
  answer: string
}

export type AnswerOption = {
  id: number
} & DropdownItem

export type CorrectSequenceQuestion = {
  id: number
  question: string
  order: number
}

export type ConnectLinesMatch = {
  id: number
  matchA: string
  matchB: string
}

export type MultipleListTextAnswerOption = {
  id: number
  value: string
  isCorrect: boolean
}

export type MultipleListTextAnswer = {
  id: number
  answers: MultipleListTextAnswerOption[]
}

/* drag&drop */

// todo: remove this sh*t
export type SystemIndex = {
  systemIndex?: string
}

export type Size = {
  width: number
  height: number
}

export type Position = {
  x: number
  y: number
}

/* drag&drop on image */
type CommonInputType = SystemIndex & {
  size: Size
  color: string
  position: Position
}

export type DroppableInput = {
  value: {
    value: string
    systemIndex: string
  }[]
} & CommonInputType

export type DraggableText = SystemIndex & {
  text: string
}

export type DraggableImage = SystemIndex & {
  size: Size
  image: string
  value: string
}

export type DroppableImage = {
  pin: Position
  value: string
} & CommonInputType

export type MovingImagesOnImageAnswer = {
  size: Size
  mainImage: string

  'draggable-text': DraggableText[]
  inputs: DroppableInput[]

  draggable: DraggableImage[]
  droppable: DroppableInput[]
}

export type MovingOnTextDroppableInput = {
  size: Size
  color: string
  value: {
    value: string
    systemIndex: string
  }[]
} & SystemIndex

export type MovingOnTextDroppableImage = {
  pin: {
    x: number
    y: number
  }
  size: {
    width: number
    height: number
  }
  color: string
  value: string
} & SystemIndex
