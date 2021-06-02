import { attach, combine, createEvent, forward, restore, sample, split } from 'effector-root'

import {
  $isFilled as $isFilledBroadFile,
  $form as $formBroadFile,
} from '@/pages/common/parts/tasks/broad-file-answer/broad-file-answer.model'
import {
  $isFilled as $isFilledBroadOpen,
  $form as $formBroadOpen,
} from '@/pages/common/parts/tasks/broad-open-answer/broad-open-answer.model'
import {
  $isFilled as $isFilledColorHighlight,
  $form as $formColorHighlight,
} from '@/pages/common/parts/tasks/color-highlight-answer/color-highlight-answer.model'
import {
  $isFilled as $isFilledCommonListString,
  $form as $formCommonListString,
} from '@/pages/common/parts/tasks/common-list-string-answer/common-list-string-answer.model'
import {
  $isFilled as $isFilledCommonListText,
  $form as $formCommonListText,
} from '@/pages/common/parts/tasks/common-list-text-answer/common-list-text-answer.model'
import {
  $isFilled as $isFilledConnectLines,
  $form as $formConnectLines,
} from '@/pages/common/parts/tasks/connect-lines-answer/connect-lines-answer.model'
import {
  $isFilled as $isFilledCorrectSequence,
  $form as $formCorrectSequence,
} from '@/pages/common/parts/tasks/correct-sequence-answer/correct-sequence-answer.model'
import {
  $isFilled as $isFilledMultipleChoiceOne,
  $form as $formMultipleChoiceOne,
} from '@/pages/common/parts/tasks/multiple-choice-one-answer/multiple-choice-one-answer.model'
import {
  $isFilled as $isFilledMultipleChoiceOneOrMany,
  $form as $formMultipleChoiceOneOrMany,
} from '@/pages/common/parts/tasks/multiple-choice-one-or-many-answers/multiple-choice-one-or-many-answers.model'
import {
  $isFilled as $isFilledMultipleListText,
  $form as $formMultipleListText,
} from '@/pages/common/parts/tasks/multiple-list-text-answer/multiple-list-text-answer.model'
import {
  $isFilled as $isFilledMultipleShortClosed,
  $form as $formMultipleShortClosed,
} from '@/pages/common/parts/tasks/multiple-short-closed-answer/multiple-short-closed-answer.model'
import {
  $isFilled as $isFilledShortClosed,
  $form as $formShortClosed,
} from '@/pages/common/parts/tasks/short-closed-answer/short-closed-answer.model'
import {
  $isFilled as $isFilledMovingOnImage,
  $form as $formMovingOnImage,
} from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/moving-images-on-image-answer.model'
import {
  $isFilled as $isFilledMovingOnText,
  $form as $formMovingOnText,
} from '@/pages/common/parts/tasks/moving-images-on-text-input-answer/moving-images-on-text-input-answer.model'

import { addToast, successToastEvent } from '@/features/toasts/toasts.model'

import { navigatePush } from '@/features/navigation'
import { DropdownItem } from '@/pages/common/types'
import { LANGUAGE_DATA } from '@/pages/bank/common/constants'
import { mapTaskTypeTo } from '@/pages/common/constants'
import { createLessonAssignmentFx } from '@/features/api/assignment/lesson-assignment/create-lesson-assignment'
import { taskTypesDropdownModule } from '@/pages/common/dropdowns/bank/task-types-dropdown/task-types-dropdown.model'
import {
  $selectedFolder,
  foldersDropdownModule,
} from '@/pages/common/dropdowns/bank/lesson-tasks/position-dropdown/position-dropdown.model'
import { condition } from 'patronum'
import { uploadAudioFiles } from '@/pages/common/parts/audio-files/audio-files-save.model'
import { AssignmentAudioFile } from '@/features/api/assignment/types/types'
import { parseError } from '@/features/lib'

const createLessonAssignment = attach({
  effect: createLessonAssignmentFx,
})

const uploadAudioFilesFx = attach({
  effect: uploadAudioFiles,
})

export const save = createEvent<void>()
export const clearFields = createEvent<void>()

export const setFolder = createEvent<number | null>()
export const $folder = restore(setFolder, null).reset(clearFields)

export const setScore = createEvent<number | null>()
export const $score = restore(setScore, 1)

export const setTaskType = createEvent<string | null>()
export const $taskType = restore(setTaskType, null)

export const setLanguage = createEvent<DropdownItem>()
export const $language = restore(setLanguage, LANGUAGE_DATA[0])

export const setAudioIds = createEvent<AssignmentAudioFile[]>()
export const $audioIds = restore(setAudioIds, [])

export const toggleNeedDuplicate = createEvent<boolean>()
export const $needDuplicate = restore(toggleNeedDuplicate, false).reset(clearFields)

export const setCount = createEvent<number>()
export const $count = restore(setCount, 0).reset(clearFields)

export const setRedirectAfterSave = createEvent<boolean>()
const $redirectAfterSave = restore(setRedirectAfterSave, false).reset(clearFields)

forward({
  from: clearFields,
  to: [
    taskTypesDropdownModule.methods.resetDropdown,
    setTaskType.prepend(() => null),
    foldersDropdownModule.methods.resetDropdown,
  ],
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
  $folder,
  $score,
  $taskType,
  $isFilled,
  (folder, score, taskType, isFilled) => {
    const isFilledTask = taskType && isFilled[mapTaskTypeTo[taskType].componentName]
    return isFilledTask && score && folder
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
  $selectedFolder,
  $folder,
  $score,
  $taskType,
  $language,
  $needDuplicate,
  $count,
  (folder, folder_id, score, taskType, language, needDuplicate, count) => ({
    type: taskType,
    folder,
    folder_id,
    score,
    interface_language: language.title,
    ...(needDuplicate ? { duplicate_count: count } : {}),
  })
)

const $generalForm = combine($baseForm, $taskType, $taskform, (baseForm, taskType, taskform) => {
  const form = taskType ? taskform[mapTaskTypeTo[taskType].componentName] : {}
  return {
    ...baseForm,
    ...form,
  }
})

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
      ...pureForm,
      audios_ids: audioFiles.map(({ id }) => id),
    }
  },
  target: createLessonAssignment,
})

const { elementNotFound } = split(createLessonAssignment.failData, {
  elementNotFound: ({ status }) => status === 400,
})

forward({
  from: elementNotFound,
  to: addToast.prepend((data: any) => ({ type: 'error', message: parseError(data.body) })),
})

forward({
  from: createLessonAssignment.doneData.map((res) => res.body.id),
  to: successToastEvent('Задание успешно создано!'),
})

const $redirectHandler = sample({
  clock: createLessonAssignment.doneData.map((res) => res.body.id),
  source: $redirectAfterSave,
  fn: (redirect, id) => ({ redirect, id }),
})

condition({
  source: $redirectHandler,
  if: (payload: { redirect: boolean; id: number }) => payload.redirect,
  then: navigatePush.prepend(() => ({ name: 'lesson-tasks-list' })),
  else: navigatePush.prepend((payload: { redirect: boolean; id: number }) => ({
    name: 'lesson-tasks-edit',
    query: {
      fromPage: 'tasks',
    },
    params: { id: `${payload.id}` },
  })),
})
