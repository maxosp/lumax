export const DEFAULT_ID = -1
export const selectItemHeight = 51
export const actionsSelectMenuMaxHeight = 255
export const BACKGROUND_IMAGE_SIZE = 900

export const mapTaskTypeTo = {
  SHORT_CLOSED_ANSWER: {
    icon: 'type-0',
    description: 'Задание с вводом короткого закрытого ответа',
    componentName: 'ShortClosedAnswer',
  },
  MULTIPLE_SHORT_CLOSED_ANSWER: {
    icon: 'type-1',
    description: 'Задание с несколькими вопросами и вводом коротких закрытых ответов',
    componentName: 'MultipleShortClosedAnswer',
  },
  MULTIPLE_CHOICE_ONE_OR_MANY_ANSWERS: {
    icon: 'type-2',
    description: 'Задание с выбором одного или нескольких правильных ответов',
    componentName: 'MultipleChoiceOneOrManyAnswers',
  },
  MULTIPLE_CHOICE_ONE_ANSWER: {
    icon: 'type-3',
    description: 'Задание с выбором одного правильного ответа',
    componentName: 'MultipleChoiceOneAnswer',
  },
  BROAD_OPEN_ANSWER: {
    icon: 'type-4',
    description: 'Задание с вводом развернутого открытого ответа',
    componentName: 'BroadOpenAnswer',
  },
  COMMON_LIST_STRING_ANSWER: {
    icon: 'type-5',
    description: 'Задание с одним общим выпадающим списком в строке',
    componentName: 'CommonListStringAnswer',
  },
  COMMON_LIST_TEXT_ANSWER: {
    icon: 'type-5',
    description: 'Задание с общим выпадающим списком в тексте',
    componentName: 'CommonListTextAnswer',
  },
  MULTIPLE_LIST_TEXT_ANSWER: {
    icon: 'type-5',
    description: 'Задание с различными выпадающими списками в тексте',
    componentName: 'MultipleListTextAnswer',
  },
  CORRECT_SEQUENCE_ANSWER: {
    icon: 'type-6',
    description: 'Задание на установление правильной последовательности с перемещением элементов',
    componentName: 'CorrectSequenceAnswer',
  },
  CONNECT_LINES_ANSWER: {
    icon: 'type-6',
    description: 'Задание на сопоставление с соединением частей линией',
    componentName: 'ConnectLinesAnswer',
  },
  MOVING_IMAGES_IMAGE_INPUT_ANSWER: {
    icon: 'type-7',
    description: 'Задание с перемещением картинок и вводом данных в поле на картинке',
    componentName: 'MovingImagesOnImageInputAnswer',
  },
  MOVING_IMAGES_TEXT_INPUT_ANSWER: {
    icon: 'type-7',
    description: 'Задание с перемещением картинок и вводом данных в поле в тексте',
    componentName: 'MovingImagesOnTextInputAnswer',
  },
  BROAD_FILE_ANSWER: {
    icon: 'type-8',
    description: 'Задание с вводом развернутого открытого ответа и/или прикреплением файла',
    componentName: 'BroadFileAnswer',
  },
  COLOR_HIGHLIGHT_ANSWER: {
    icon: 'type-9',
    description: 'Задание с цветовым выделением в тексте',
    componentName: 'ColorHighlightAnswer',
  },
}
