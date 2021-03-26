import { Position, Size } from '@/pages/common/parts/tasks/types'

export type MovingOnImageInput = {
  value: {
    value: string
    id: number
  }[]
  id: number
  size: Size
  color: string
  position: Position
}

export type MovingOnImageQuestionData = {
  draggable: {
    id: number
    size: Size
    value: number
    image: string
  }[]
  droppable: {
    id: number
    pin: Position
    position: Position
    size: Size
    color: string
    value: number
  }[]
  'draggable-text': {
    text: string
    id: number
  }[]
  inputs: MovingOnImageInput[]
  mainImage: string
  size: Size
}
