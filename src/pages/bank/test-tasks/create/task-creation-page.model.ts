import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import { createTestAssignmentFx } from '@/features/api/assignment/test-assignment/create-test-assignment'
import {
  $themes,
  themesDropdownModule,
} from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'
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
import { $selectedLabels } from '@/pages/bank/test-tasks/create/parts/labels-dropdown/labels-dropdown.model'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { AssignmentAudioFile } from '@/features/api/assignment/types'
import { navigatePush } from '@/features/navigation'
import { mapTaskTypeTo } from '@/pages/common/constants'
import { DropdownItem } from '@/pages/common/types'
import { LANGUAGE_DATA } from '@/pages/bank/common/constants'
import { condition } from 'patronum'
import { classesDropdownModule } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import { subjectsDropdownModule } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { taskTypesDropdownModule } from '@/pages/common/dropdowns/bank/task-types-dropdown/task-types-dropdown.model'
import { difficultiesDropdownModule } from '@/pages/bank/test-tasks/create/parts/difficulties-dropdown/difficulties-dropdown.model'
import { uploadAudioFiles } from '@/pages/common/parts/audio-files/audio-files-save.model'

const createTestAssignment = attach({
  effect: createTestAssignmentFx,
})

const uploadAudioFilesFx = attach({
  effect: uploadAudioFiles,
})

export const setSubject = createEvent<number | null>()
export const $subject = restore(setSubject, null)

export const setClass = createEvent<number | null>()
export const $class = restore(setClass, null)

export const setTheme = createEvent<number | null>()
export const $theme = restore(setTheme, null)

export const setDifficulty = createEvent<string | null>()
export const $difficulty = restore(setDifficulty, null)

export const setTaskType = createEvent<string | null>()
export const $taskType = restore(setTaskType, null)

export const toggleNeedDuplicate = createEvent<boolean>()
export const $needDuplicate = restore(toggleNeedDuplicate, false)

export const setCount = createEvent<number>()
export const $count = restore(setCount, 1)

export const setLanguage = createEvent<DropdownItem>()
export const $language = restore(setLanguage, LANGUAGE_DATA[0])

export const setAudioIds = createEvent<AssignmentAudioFile[]>()
export const $audioIds = restore(setAudioIds, [])

export const save = createEvent<void>()
export const clearFields = createEvent<void>()

export const setRedirectAfterSave = createEvent<boolean>()
const $redirectAfterSave = restore(setRedirectAfterSave, false).reset(clearFields)

forward({
  from: clearFields,
  to: [
    classesDropdownModule.methods.resetDropdown,
    subjectsDropdownModule.methods.resetDropdown,
    taskTypesDropdownModule.methods.resetDropdown,
    setTaskType.prepend(() => null),
    themesDropdownModule.methods.resetDropdown,
    difficultiesDropdownModule.methods.resetDropdown,
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
  $theme,
  $difficulty,
  $taskType,
  $isFilled,
  (subject, selectedClass, theme, difficulty, taskType, isFilled) => {
    const $isFilledTask = taskType && isFilled[mapTaskTypeTo[taskType].componentName]
    return $isFilledTask && theme && difficulty && subject && selectedClass
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
  $subject,
  $class,
  $theme,
  $themes,
  $difficulty,
  $taskType,
  $needDuplicate,
  $count,
  $selectedLabels,
  $language,
  (
    subject_id,
    study_year_id,
    theme_id,
    themes,
    difficulty,
    taskType,
    needDuplicate,
    count,
    labels,
    language
  ) => ({
    status: 'new',
    subject_id,
    study_year_id,
    type: taskType,
    theme: themes.find((theme) => theme.id === theme_id),
    theme_id,
    difficulty,
    labels: labels.map(({ name }) => name),
    ...(needDuplicate ? { duplicate_count: count } : {}),
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
  target: createTestAssignment,
})

forward({
  from: createTestAssignment.doneData,
  to: successToastEvent('Задание успешно создано!'),
})

const $redirectHandler = sample({
  clock: createTestAssignment.doneData.map((res) => res.body.id),
  source: $redirectAfterSave,
  fn: (redirect, id) => ({ redirect, id }),
})

condition({
  source: $redirectHandler,
  if: (payload: { redirect: boolean; id: number }) => payload.redirect,
  then: navigatePush.prepend(() => ({ name: 'test-tasks-list' })),
  else: navigatePush.prepend((payload: { redirect: boolean; id: number }) => ({
    name: 'test-tasks-edit',
    params: { id: `${payload.id}` },
  })),
})
