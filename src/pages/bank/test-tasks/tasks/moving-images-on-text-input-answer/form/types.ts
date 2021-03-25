import { Position, Size } from '@/pages/bank/test-tasks/tasks/types'

export type MovingOnTextInput = {
  value: {
    value: string
    id: number
  }[]
  id: number
  size: Size
  color: string
}

export type MovingOnTextQuestionData = {
  draggable: {
    id: number
    size: Size
    value: number
    image: string
  }[]
  mainText: string
  droppable: {
    id: number
    pin: Position
    size: Size
    color: string
    value: number
  }[]
  'draggable-text': {
    text: string
    id: number
  }[]
  inputs: MovingOnTextInput[]
  mainImage: string
  size: Size
}
