export const DEFAULT_ID = -1
export const selectItemHeight = 51
export const actionsSelectMenuMaxHeight = 255

export const mapTaskTypeTo = {
  SHORT_CLOSED_ANSWER: {
    icon: 'type-0',
    description: 'Задание с вводом короткого закрытого ответа',
  },
  MULTIPLE_SHORT_CLOSED_ANSWER: {
    icon: 'type-1',
    description: 'Задание с несколькими вопросами и вводом коротких закрытых ответов',
  },
  MULTIPLE_CHOICE_ONE_OR_MANY_ANSWERS: {
    icon: 'type-2',
    description: 'Задание с выбором одного или нескольких правильных ответов',
  },
  MULTIPLE_CHOICE_ONE_ANSWER: {
    icon: 'type-3',
    description: 'Задание с выбором одного правильного ответа',
  },
  BROAD_OPEN_ANSWER: {
    icon: 'type-4',
    description: 'Задание с вводом развернутого открытого ответа',
  },
  COMMON_LIST_STRING_ANSWER: {
    icon: 'type-5',
    description: 'Задание с одним общим выпадающим списком в строке',
  },
  COMMON_LIST_TEXT_ANSWER: {
    icon: 'type-5',
    description: 'Задание с общим выпадающим списком в тексте',
  },
  MULTIPLE_LIST_TEXT_ANSWER: {
    icon: 'type-5',
    description: 'Задание с различными выпадающими списками в тексте',
  },
  CORRECT_SEQUENCE_ANSWER: {
    icon: 'type-6',
    description: 'Задание на установление правильной последовательности с перемещением элементов',
  },
  CONNECT_LINES_ANSWER: {
    icon: 'type-6',
    description: 'Задание на сопоставление с соединением частей линией',
  },
  MOVING_IMAGES_IMAGE_INPUT_ANSWER: {
    icon: 'type-7',
    description: 'Задание с перемещением картинок и вводом данных в поле на картинке',
  },
  MOVING_IMAGES_TEXT_INPUT_ANSWER: {
    icon: 'type-7',
    description: 'Задание с перемещением картинок и вводом данных в поле в тексте',
  },
  BROAD_FILE_ANSWER: {
    icon: 'type-8',
    description: 'Задание с вводом развернутого открытого ответа и/или прикреплением файла',
  },
  COLOR_HIGHLIGHT_ANSWER: {
    icon: 'type-9',
    description: 'Задание с цветовым выделением в тексте',
  },
}
