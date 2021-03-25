import { attach, combine, createEffect, createEvent, forward, restore, sample } from 'effector-root'
import { updateTestAssignmentFx } from '@/features/api/assignment/test-assignment/update-test-assignment'
import { getTestAssignmentFx } from '@/features/api/assignment/test-assignment/get-test-assignment'
import { uploadAudioFx } from '@/features/api/assignment/audio/upload-audio'

import {
  $isFilled as $isFilledBroadFile,
  $form as $formBroadFile,
  initAssignment as initBroadFileTask,
} from '@/pages/bank/test-tasks/tasks/broad-file-answer/broad-file-answer.model'
import {
  $isFilled as $isFilledBroadOpen,
  $form as $formBroadOpen,
  initAssignment as initBroadOpenTask,
} from '@/pages/bank/test-tasks/tasks/broad-open-answer/broad-open-answer.model'
import {
  $isFilled as $isFilledColorHighlight,
  $form as $formColorHighlight,
  initAssignment as initColorHighlightTask,
} from '@/pages/bank/test-tasks/tasks/color-highlight-answer/color-highlight-answer.model'
import {
  $isFilled as $isFilledCommonListString,
  $form as $formCommonListString,
  initAssignment as initCommonListStringTask,
} from '@/pages/bank/test-tasks/tasks/common-list-string-answer/common-list-string-answer.model'
import {
  $isFilled as $isFilledCommonListText,
  $form as $formCommonListText,
  initAssignment as initCommonListTextTask,
} from '@/pages/bank/test-tasks/tasks/common-list-text-answer/common-list-text-answer.model'
import {
  $isFilled as $isFilledConnectLines,
  $form as $formConnectLines,
  initAssignment as initConnectLinesTask,
} from '@/pages/bank/test-tasks/tasks/connect-lines-answer/connect-lines-answer.model'
import {
  $isFilled as $isFilledCorrectSequence,
  $form as $formCorrectSequence,
  initAssignment as initCorrectSequenceTask,
} from '@/pages/bank/test-tasks/tasks/correct-sequence-answer/correct-sequence-answer.model'
import {
  $isFilled as $isFilledMultipleChoiceOne,
  $form as $formMultipleChoiceOne,
  initAssignment as initMultipleChoiceOneTask,
} from '@/pages/bank/test-tasks/tasks/multiple-choice-one-answer/multiple-choice-one-answer.model'
import {
  $isFilled as $isFilledMultipleChoiceOneOrMany,
  $form as $formMultipleChoiceOneOrMany,
  initAssignment as initMultipleChoiceOneOrManyTask,
} from '@/pages/bank/test-tasks/tasks/multiple-choice-one-or-many-answers/multiple-choice-one-or-many-answers.model'
import {
  $isFilled as $isFilledMultipleListText,
  $form as $formMultipleListText,
  initAssignment as initMultipleListTask,
} from '@/pages/bank/test-tasks/tasks/multiple-list-text-answer/multiple-list-text-answer.model'
import {
  $isFilled as $isFilledMultipleShortClosed,
  $form as $formMultipleShortClosed,
  initAssignment as initMultipleShortClosedTask,
} from '@/pages/bank/test-tasks/tasks/multiple-short-closed-answer/multiple-short-closed-answer.model'
import {
  $isFilled as $isFilledShortClosed,
  $form as $formShortClosed,
  initAssignment as initShortClosedTask,
} from '@/pages/bank/test-tasks/tasks/short-closed-answer/short-closed-answer.model'
import {
  $isFilled as $isFilledMovingOnImage,
  $form as $formMovingOnImage,
  initAssignment as initMovingOnImageTask,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/moving-images-on-image-answer.model'
import {
  $isFilled as $isFilledMovingOnText,
  $form as $formMovingOnText,
  initAssignment as initMovingOnTextTask,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-text-input-answer/moving-images-on-text-input-answer.model'

import { difficultiesDropdownModule } from '@/pages/bank/test-tasks/edit/parts/difficulties-dropdown/difficulties-dropdown.model'
import { taskTypesDropdownModule } from '@/pages/bank/test-tasks/edit/parts/task-types-dropdown/task-types-dropdown.model'
import {
  $themesData,
  themesDropdownModule,
} from '@/pages/bank/test-tasks/edit/parts/themes-dropdown/themes-dropdown.model'

import { $selectedLabels } from '@/pages/bank/test-tasks/edit/parts/labels-dropdown/labels-dropdown.model'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { mapTaskTypeToComponent } from '@/pages/bank/test-tasks/edit/parts/task-types-dropdown/constants'
import { AssignmentAudioFile } from '@/features/api/assignment/types'
import { AudioFile } from '@/pages/bank/test-tasks/tasks/types'

const updateAssignment = attach({
  effect: updateTestAssignmentFx,
})

export const loadAssignment = attach({
  effect: getTestAssignmentFx,
})

export const loadTask = createEvent<number>()
export const $taskId = restore(loadTask, 0)

export const setTheme = createEvent<number | null>()
export const $theme = restore(setTheme, null)

export const setDifficulty = createEvent<string | null>()
export const $difficulty = restore(setDifficulty, null)

export const setTaskType = createEvent<string | null>()
export const $taskType = restore(setTaskType, null)

export const toggleNeedDuplicate = createEvent<boolean>()
export const $needDuplicate = restore(toggleNeedDuplicate, false)

export const setCount = createEvent<number>()
export const $count = restore(setCount, 0)

export const setAudioIds = createEvent<AssignmentAudioFile[]>()
export const $audioIds = restore(setAudioIds, [])

export const save = createEvent<void>()

forward({
  from: loadTask,
  to: loadAssignment,
})

forward({
  from: loadAssignment.doneData.map((res) => res.body),
  to: [
    themesDropdownModule.methods.itemChanged.prepend((data) => `${data.theme.id}`),
    setTheme.prepend((data) => data.theme.id || 0),
    difficultiesDropdownModule.methods.itemChanged.prepend((data) => `${data.difficulty}`),
    setDifficulty.prepend((data) => `${data.difficulty}`),
    taskTypesDropdownModule.methods.itemChanged.prepend((data) => data.type),
    setTaskType.prepend((data) => data.type),
  ],
})

const mapTaskTypeToInitFn = {
  BROAD_FILE_ANSWER: initBroadFileTask,
  BROAD_OPEN_ANSWER: initBroadOpenTask,
  COLOR_HIGHLIGHT_ANSWER: initColorHighlightTask,
  COMMON_LIST_STRING_ANSWER: initCommonListStringTask,
  COMMON_LIST_TEXT_ANSWER: initCommonListTextTask,
  CONNECT_LINES_ANSWER: initConnectLinesTask,
  CORRECT_SEQUENCE_ANSWER: initCorrectSequenceTask,
  MULTIPLE_CHOICE_ONE_ANSWER: initMultipleChoiceOneTask,
  MULTIPLE_CHOICE_ONE_OR_MANY_ANSWERS: initMultipleChoiceOneOrManyTask,
  MULTIPLE_LIST_TEXT_ANSWER: initMultipleListTask,
  MULTIPLE_SHORT_CLOSED_ANSWER: initMultipleShortClosedTask,
  SHORT_CLOSED_ANSWER: initShortClosedTask,
  MOVING_IMAGES_IMAGE_INPUT_ANSWER: initMovingOnImageTask,
  MOVING_IMAGES_TEXT_INPUT_ANSWER: initMovingOnTextTask,
}

sample({
  source: loadAssignment.doneData.map((res) => res.body),
  fn: (assignment) => {
    console.log('TASK:', assignment)
    mapTaskTypeToInitFn[assignment.type](assignment)
    return assignment
  },
})

const $isFilled = combine({
  BroadFileAnswer: $isFilledBroadFile,
  BroadOpenAnswer: $isFilledBroadOpen,
  ColorHighlightAnswer: $isFilledColorHighlight,
  CommonListStringAnswer: $isFilledCommonListString,
  CommonListTextAnswer: $isFilledCommonListText,
  ConnectLinesAnswer: $isFilledConnectLines,
  CorrectSequenceAnswer: $isFilledCorrectSequence,
  MultipleChoiceOneAnswer: $isFilledMultipleChoiceOne,
  MultipleChoiceOneOrManyAnswers: $isFilledMultipleChoiceOneOrMany,
  MultipleListTextAnswer: $isFilledMultipleListText,
  MultipleShortClosedAnswer: $isFilledMultipleShortClosed,
  ShortClosedAnswer: $isFilledShortClosed,
  MovingImagesOnImageInputAnswer: $isFilledMovingOnImage,
  MovingImagesOnTextInputAnswer: $isFilledMovingOnText,
})

export const $canSave = combine(
  $theme,
  $difficulty,
  $taskType,
  $isFilled,
  (theme, difficulty, taskType, isFilled) => {
    const $isFilledTask = taskType && isFilled[mapTaskTypeToComponent[taskType]]
    return $isFilledTask && theme && difficulty
  }
)

const $taskform = combine({
  BroadFileAnswer: $formBroadFile,
  BroadOpenAnswer: $formBroadOpen,
  ColorHighlightAnswer: $formColorHighlight,
  CommonListStringAnswer: $formCommonListString,
  CommonListTextAnswer: $formCommonListText,
  ConnectLinesAnswer: $formConnectLines,
  CorrectSequenceAnswer: $formCorrectSequence,
  MultipleChoiceOneAnswer: $formMultipleChoiceOne,
  MultipleChoiceOneOrManyAnswers: $formMultipleChoiceOneOrMany,
  MultipleListTextAnswer: $formMultipleListText,
  MultipleShortClosedAnswer: $formMultipleShortClosed,
  ShortClosedAnswer: $formShortClosed,
  MovingImagesOnImageInputAnswer: $formMovingOnImage,
  MovingImagesOnTextInputAnswer: $formMovingOnText,
})

const $baseForm = combine(
  $theme,
  $themesData,
  $difficulty,
  $taskType,
  $needDuplicate,
  $count,
  $selectedLabels,
  (theme_id, themes, difficulty, taskType, needDuplicate, count, labels) => ({
    status: 'new',
    is_test_assignment: true,
    type: taskType,
    theme: themes.find((theme) => theme.id === theme_id),
    theme_id,
    difficulty,
    labels: labels.map(({ name }) => name),
    ...(needDuplicate ? { duplicate_count: count } : {}),
  })
)

const uploadAudioFilesFx = createEffect({
  handler: (audioFiles: AudioFile[]): Promise<AssignmentAudioFile[]> =>
    Promise.all(
      audioFiles.map(
        (file) =>
          new Promise<AssignmentAudioFile>((resolve) => {
            const res = uploadAudioFx({
              media: file.id,
              ...(file.isLimited ? { audio_limit_count: file.limit } : {}),
            }).then((r: any) => r.body)
            resolve(res)
          })
      )
    ),
})

const $generalForm = combine(
  $taskId,
  $baseForm,
  $taskType,
  $taskform,
  (id, baseForm, taskType, taskform) => {
    const form = taskType ? taskform[mapTaskTypeToComponent[taskType]] : {}
    return {
      ...baseForm,
      ...form,
      id,
    }
  }
)

sample({
  source: $generalForm,
  clock: save,
  fn: ({ audio }) => audio,
  target: uploadAudioFilesFx,
})

sample({
  source: $generalForm,
  clock: uploadAudioFilesFx.doneData,
  fn: (form: any, audioFiles: AssignmentAudioFile[]) => {
    // eslint-disable-next-line
    const { audio, ...pureForm } = form
    return {
      id: pureForm.id,
      body: {
        ...pureForm,
        audio_ids: audioFiles.map(({ media }) => media),
      },
    }
  },
  target: updateAssignment,
})

forward({
  from: updateAssignment.doneData,
  to: successToastEvent('Задание успешно сохранено!'),
})
