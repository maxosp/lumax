export const LANGUAGE_DATA = [
  { name: 'russian', title: 'Русский' },
  { name: 'english', title: 'Английский' },
]

export const TASK_TYPES_DATA = [
  {
    name: 'SHORT_CLOSED_ANSWER',
    title: 'Задание с вводом короткого закрытого ответа',
  },
  {
    name: 'MULTIPLE_SHORT_CLOSED_ANSWER',
    title: 'Задание с несколькими вопросами и вводом коротких закрытых ответов',
  },
  {
    name: 'MULTIPLE_CHOICE_ONE_OR_MANY_ANSWERS',
    title: 'Задание с выбором одного или нескольких правильных ответов',
  },
  {
    name: 'MULTIPLE_CHOICE_ONE_ANSWER',
    title: 'Задание с выбором одного правильного ответа',
  },
  {
    name: 'BROAD_OPEN_ANSWER',
    title: 'Задание с вводом развернутого открытого ответа',
  },
  {
    name: 'COMMON_LIST_STRING_ANSWER',
    title: 'Задание с одним общим выпадающим списком в строке',
  },
  {
    name: 'CORRECT_SEQUENCE_ANSWER',
    title: 'Задание на установление правильной последовательности с перемещением элементов',
  },
  {
    name: 'CONNECT_LINES_ANSWER',
    title: 'Задание на сопоставление с соединением частей линией',
  },
  {
    name: 'MOVING_IMAGES_IMAGE_INPUT_ANSWER',
    title: 'Задание с перемещением картинок и вводом данных в поле на картинке',
  },
  {
    name: 'MOVING_IMAGES_TEXT_INPUT_ANSWER',
    title: 'Задание с перемещением картинок и вводом данных в поле в тексте',
  },
  {
    name: 'COMMON_LIST_TEXT_ANSWER',
    title: 'Задание с общим выпадающим списком в тексте',
  },
  {
    name: 'MULTIPLE_LIST_TEXT_ANSWER',
    title: 'Задание с различными выпадающими списками в тексте',
  },
  {
    name: 'BROAD_FILE_ANSWER',
    title: 'Задание с вводом развернутого открытого ответа и/или прикреплением файла',
  },
  {
    name: 'COLOR_HIGHLIGHT_ANSWER',
    title: 'Задание с цветовым выделением в тексте',
  },
]

export const mapTaskTypeToComponent = {
  SHORT_CLOSED_ANSWER: 'ShortClosedAnswer',
  MULTIPLE_SHORT_CLOSED_ANSWER: 'MultipleShortClosedAnswer',
  MULTIPLE_CHOICE_ONE_OR_MANY_ANSWERS: 'MultipleChoiceOneOrManyAnswers',
  MULTIPLE_CHOICE_ONE_ANSWER: 'MultipleChoiceOneAnswer',
  BROAD_OPEN_ANSWER: 'BroadOpenAnswer',
  COMMON_LIST_STRING_ANSWER: 'CommonListStringAnswer',
  CORRECT_SEQUENCE_ANSWER: 'CorrectSequenceAnswer',
  CONNECT_LINES_ANSWER: 'ConnectLinesAnswer',
  MOVING_IMAGES_IMAGE_INPUT_ANSWER: 'MovingImagesOnImageInputAnswer',
  MOVING_IMAGES_TEXT_INPUT_ANSWER: 'MovingImagesOnTextInputAnswer',
  COMMON_LIST_TEXT_ANSWER: 'CommonListTextAnswer',
  MULTIPLE_LIST_TEXT_ANSWER: 'MultipleListTextAnswer',
  BROAD_FILE_ANSWER: 'BroadFileAnswer',
  COLOR_HIGHLIGHT_ANSWER: 'ColorHighlightAnswer',
}
