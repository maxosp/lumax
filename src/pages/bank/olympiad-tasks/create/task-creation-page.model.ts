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

import {
  $selectedTags,
  getTags,
  resetSelectedTags,
} from '@/pages/bank/olympiad-tasks/create/parts/tags-dropdown/tags-dropdown.model'

import { addToast, successToastEvent } from '@/features/toasts/toasts.model'

import { navigatePush } from '@/features/navigation'
import { DropdownItem } from '@/pages/common/types'
import { LANGUAGE_DATA } from '@/pages/bank/common/constants'
import { mapTaskTypeTo } from '@/pages/common/constants'
import { combineEvents, condition, debounce, every } from 'patronum'
import { createOlympiadAssignmentFx } from '@/features/api/assignment/olympiad-assignment/create-olympiad-assignment'
import { classesDropdownModule } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import { subjectsDropdownModel } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { scoreDropdownModule } from '@/pages/common/dropdowns/bank/olympiad-tasks/score-dropdown/score-dropdown.model'
import {
  $clues,
  resetCluesList,
  uploadCluesFx,
} from '@/pages/common/parts/tasks/parts/clues/clues.model'
import { taskTypesDropdownModule } from '@/pages/common/dropdowns/bank/task-types-dropdown/task-types-dropdown.model'
import { uploadAudioFiles } from '@/pages/common/parts/audio-files/audio-files-save.model'
import { AssignmentAudioFile } from '@/features/api/assignment/types/types'
import { parseError } from '@/features/lib'

const createOlympiadAssignment = attach({
  effect: createOlympiadAssignmentFx,
})

export const clearFields = createEvent<void>()

export const setSubject = createEvent<number | null>()
export const $subject = restore(setSubject, null)

export const setClass = createEvent<number | null>()
export const $class = restore(setClass, null)

export const setScore = createEvent<number | null>()
export const $score = restore(setScore, null)

export const setTaskType = createEvent<string | null>()
export const $taskType = restore(setTaskType, null).reset(clearFields)

export const setLanguage = createEvent<DropdownItem>()
export const $language = restore(setLanguage, LANGUAGE_DATA[0])

export const setAudioIds = createEvent<AssignmentAudioFile[]>()
export const $audioIds = restore(setAudioIds, [])

export const showSolutionEnabledChanged = createEvent<boolean>()
export const $showSolutionEnabled = restore(showSolutionEnabledChanged, false).reset(clearFields)

export const setSolutionText = createEvent<string>()
export const $solutionText = restore(setSolutionText, '').reset(clearFields)

export const save = createEvent<void>()

export const setRedirectAfterSave = createEvent<boolean>()
const $redirectAfterSave = restore(setRedirectAfterSave, false).reset(clearFields)

export const $canSetTags = every({
  predicate: (value) => value !== null,
  stores: [$subject, $class],
})
const $formToGetTagsList = combine($class, $subject, (cl, obj) => ({
  study_year: cl || undefined,
  subject: obj || undefined,
}))

const debounced = debounce({
  source: $formToGetTagsList,
  timeout: 150,
})

forward({
  from: debounced,
  to: getTags,
})

forward({
  from: clearFields,
  to: [
    classesDropdownModule.methods.resetDropdown,
    subjectsDropdownModel.methods.resetDropdown,
    scoreDropdownModule.methods.resetDropdown,
    taskTypesDropdownModule.methods.resetDropdown,
    resetCluesList,
    resetSelectedTags,
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
  $subject,
  $class,
  $score,
  $taskType,
  $isFilled,
  (subject, selectedClass, score, taskType, isFilled) => {
    const isFilledTask = taskType && isFilled[mapTaskTypeTo[taskType].componentName]
    return isFilledTask && subject && selectedClass && score
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

export const $baseForm = combine(
  $subject,
  $class,
  $score,
  $taskType,
  $selectedTags,
  $solutionText,
  $clues,
  $language,
  (subject_id, study_year_id, score, taskType, tags, answer_text, clues, language) => ({
    type: taskType,
    subject_id,
    study_year_id,
    score,
    tags: tags.map(({ name }) => name),
    answer_text,
    clues: clues.map(({ text, scores, number }) => ({ text, scores, number })),
    interface_language: language.title,
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
  target: uploadAudioFiles,
})

sample({
  source: $clues,
  clock: save,
  target: uploadCluesFx,
})

const uploadEvent = combineEvents({
  events: [uploadAudioFiles.doneData, uploadCluesFx.doneData],
})

sample({
  source: $generalForm,
  clock: uploadEvent,
  fn: (form: any, [audios, clues]) => {
    const { ...pureForm } = form
    return {
      ...pureForm,
      audios_ids: audios.map(({ id }) => id),
      clues: clues.map(({ id }) => id),
    }
  },
  target: createOlympiadAssignment,
})

const { elementNotFound } = split(createOlympiadAssignment.failData, {
  elementNotFound: ({ status }) => status === 400,
})

forward({
  from: elementNotFound,
  to: addToast.prepend((data: any) => ({ type: 'error', message: parseError(data.body) })),
})

forward({
  from: createOlympiadAssignment.doneData.map((res) => res.body.id),
  to: successToastEvent('Задание успешно создано!'),
})

const $redirectHandler = sample({
  clock: createOlympiadAssignment.doneData.map((res) => res.body.id),
  source: $redirectAfterSave,
  fn: (redirect, id) => ({ redirect, id }),
})

condition({
  source: $redirectHandler,
  if: (payload: { redirect: boolean; id: number }) => payload.redirect,
  then: navigatePush.prepend(() => ({ name: 'olympiad-tasks-list' })),
  else: navigatePush.prepend((payload: { redirect: boolean; id: number }) => ({
    name: 'olympiad-tasks-edit',
    query: {
      fromPage: 'tasks',
    },
    params: { id: `${payload.id}` },
  })),
})
