import {
  attach,
  combine,
  createEffect,
  createEvent,
  forward,
  guard,
  restore,
  sample,
} from 'effector-root'
import { updateTestAssignmentFx } from '@/features/api/assignment/test-assignment/update-test-assignment'
import { getTestAssignmentFx } from '@/features/api/assignment/test-assignment/get-test-assignment'
import { uploadAudioFx } from '@/features/api/assignment/audio/upload-audio'

import {
  $isFilled as $isFilledBroadFile,
  $form as $formBroadFile,
  initAssignment as initBroadFileTask,
} from '@/pages/common/parts/tasks/broad-file-answer/broad-file-answer.model'
import {
  $isFilled as $isFilledBroadOpen,
  $form as $formBroadOpen,
  initAssignment as initBroadOpenTask,
} from '@/pages/common/parts/tasks/broad-open-answer/broad-open-answer.model'
import {
  $isFilled as $isFilledColorHighlight,
  $form as $formColorHighlight,
  initAssignment as initColorHighlightTask,
} from '@/pages/common/parts/tasks/color-highlight-answer/color-highlight-answer.model'
import {
  $isFilled as $isFilledCommonListString,
  $form as $formCommonListString,
  initAssignment as initCommonListStringTask,
} from '@/pages/common/parts/tasks/common-list-string-answer/common-list-string-answer.model'
import {
  $isFilled as $isFilledCommonListText,
  $form as $formCommonListText,
  initAssignment as initCommonListTextTask,
} from '@/pages/common/parts/tasks/common-list-text-answer/common-list-text-answer.model'
import {
  $isFilled as $isFilledConnectLines,
  $form as $formConnectLines,
  initAssignment as initConnectLinesTask,
} from '@/pages/common/parts/tasks/connect-lines-answer/connect-lines-answer.model'
import {
  $isFilled as $isFilledCorrectSequence,
  $form as $formCorrectSequence,
  initAssignment as initCorrectSequenceTask,
} from '@/pages/common/parts/tasks/correct-sequence-answer/correct-sequence-answer.model'
import {
  $isFilled as $isFilledMultipleChoiceOne,
  $form as $formMultipleChoiceOne,
  initAssignment as initMultipleChoiceOneTask,
} from '@/pages/common/parts/tasks/multiple-choice-one-answer/multiple-choice-one-answer.model'
import {
  $isFilled as $isFilledMultipleChoiceOneOrMany,
  $form as $formMultipleChoiceOneOrMany,
  initAssignment as initMultipleChoiceOneOrManyTask,
} from '@/pages/common/parts/tasks/multiple-choice-one-or-many-answers/multiple-choice-one-or-many-answers.model'
import {
  $isFilled as $isFilledMultipleListText,
  $form as $formMultipleListText,
  initAssignment as initMultipleListTask,
} from '@/pages/common/parts/tasks/multiple-list-text-answer/multiple-list-text-answer.model'
import {
  $isFilled as $isFilledMultipleShortClosed,
  $form as $formMultipleShortClosed,
  initAssignment as initMultipleShortClosedTask,
} from '@/pages/common/parts/tasks/multiple-short-closed-answer/multiple-short-closed-answer.model'
import {
  $isFilled as $isFilledShortClosed,
  $form as $formShortClosed,
  initAssignment as initShortClosedTask,
} from '@/pages/common/parts/tasks/short-closed-answer/short-closed-answer.model'
import {
  $isFilled as $isFilledMovingOnImage,
  $form as $formMovingOnImage,
  initAssignment as initMovingOnImageTask,
} from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/moving-images-on-image-answer.model'
import {
  $isFilled as $isFilledMovingOnText,
  $form as $formMovingOnText,
  initAssignment as initMovingOnTextTask,
} from '@/pages/common/parts/tasks/moving-images-on-text-input-answer/moving-images-on-text-input-answer.model'

import { difficultiesDropdownModule } from '@/pages/bank/test-tasks/edit/parts/difficulties-dropdown/difficulties-dropdown.model'
import { taskTypesDropdownModule } from '@/pages/common/dropdowns/bank/task-types-dropdown/task-types-dropdown.model'
import {
  $themes,
  themesDropdownModule,
} from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'

import { $selectedLabels } from '@/pages/bank/test-tasks/edit/parts/labels-dropdown/labels-dropdown.model'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { mapTaskTypeToComponent } from '@/pages/common/dropdowns/bank/task-types-dropdown/constants'
import { AssignmentAudioFile } from '@/features/api/assignment/types'
import { AudioFile } from '@/pages/common/parts/tasks/types'
import { DropdownItem } from '@/pages/common/types'
import { LANGUAGE_DATA } from '@/pages/bank/common/constants'
import { navigatePush } from '@/features/navigation'
import {
  classesDropdownModule,
  setSelectedClass,
} from '@/pages/common/dropdowns/class/classes-dropdown.model'
import {
  setSelectedSubject,
  subjectsDropdownModule,
} from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { updateTestAssignmentBulkFx } from '@/features/api/assignment/test-assignment/update-test-assignment-bulk'
import { condition } from 'patronum'

const updateAssignment = attach({
  effect: updateTestAssignmentFx,
})

export const duplicateTestAssignment = attach({
  effect: updateTestAssignmentBulkFx,
})

export const loadAssignment = attach({
  effect: getTestAssignmentFx,
})

export const loadTask = createEvent<number>()
export const $taskId = restore(loadTask, 0)

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

export const setCount = createEvent<number>()
export const $count = restore(setCount, 0)

export const setLanguage = createEvent<DropdownItem>()
export const $language = restore(setLanguage, LANGUAGE_DATA[0])

export const setAudioIds = createEvent<AssignmentAudioFile[]>()
export const $audioIds = restore(setAudioIds, [])

export const setStatus = createEvent<string | null>()
export const $status = restore(setStatus, null)

export const setIsArchive = createEvent<boolean>()
export const $isArchive = restore(setIsArchive, false)

export const setIsPublished = createEvent<boolean>()
export const $isPublished = restore(setIsPublished, false)

export const duplicateAssignment = createEvent<void>()

export const save = createEvent<void>()
export const clearFields = createEvent<void>()

export const setRedirectAfterSave = createEvent<boolean>()
const $redirectAfterSave = restore(setRedirectAfterSave, false).reset(clearFields)

export const toggleIsPreview = createEvent<boolean>()
export const $isPreview = restore(toggleIsPreview, false)

condition({
  source: setIsArchive,
  if: (payload: boolean) => payload,
  then: setIsPublished.prepend((data) => !data),
})

condition({
  source: setIsPublished,
  if: (payload: boolean) => payload,
  then: setIsArchive.prepend((data) => !data),
})

forward({
  from: clearFields,
  to: [
    classesDropdownModule.methods.resetDropdown,
    subjectsDropdownModule.methods.resetDropdown,
    taskTypesDropdownModule.methods.resetDropdown,
    setTaskType.prepend(() => null),
    themesDropdownModule.methods.resetDropdown,
    difficultiesDropdownModule.methods.resetDropdown,
    setIsArchive.prepend(() => false),
    setIsPublished.prepend(() => false),
  ],
})

forward({
  from: loadTask,
  to: loadAssignment,
})

forward({
  from: loadAssignment.doneData.map((res) => res.body),
  to: [
    subjectsDropdownModule.methods.itemChanged.prepend((data) => `${data.theme.subject?.id}`),
    setSelectedSubject.prepend((data) => ({
      name: data && data.theme.subject ? `${data.theme.subject.id}` : '',
      title: data && data.theme.subject ? data.theme.subject.name : '',
    })),
    setSubject.prepend((data) => data.theme?.subject?.id || 0),
    classesDropdownModule.methods.itemChanged.prepend((data) => `${data.theme.study_year?.id}`),
    setClass.prepend((data) => data.theme?.study_year?.id || 0),
    setSelectedClass.prepend((data) => ({
      name: data && data.theme.study_year ? `${data.theme.study_year.id}` : '',
      title: data && data.theme.study_year ? data.theme.study_year.name : '',
    })),
    themesDropdownModule.methods.itemChanged.prepend((data) => `${data.theme.id}`),
    setTheme.prepend((data) => data.theme.id || 0),
    difficultiesDropdownModule.methods.itemChanged.prepend((data) => `${data.difficulty}`),
    setDifficulty.prepend((data) => `${data.difficulty}`),
    taskTypesDropdownModule.methods.itemChanged.prepend((data) => data.type),
    setTaskType.prepend((data) => data.type),
    setLanguage.prepend((data) => ({
      name: data.interface_language,
      title: data.interface_language,
    })),
    setStatus.prepend((data) => data.status),
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
  $subject,
  $class,
  $theme,
  $difficulty,
  $taskType,
  $isFilled,
  (subject, selectedClass, theme, difficulty, taskType, isFilled) => {
    const $isFilledTask = taskType && isFilled[mapTaskTypeToComponent[taskType]]
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

const $correctStatus = combine(
  $status,
  $isArchive,
  $isPublished,
  (status, isArchive, isPublished) => {
    let res = status
    if (isArchive) res = 'archive'
    if (isPublished) res = 'published'
    return res
  }
)
const $baseForm = combine(
  $correctStatus,
  $subject,
  $class,
  $theme,
  $themes,
  $difficulty,
  $taskType,
  $selectedLabels,
  $language,
  (
    correctStatus,
    subject_id,
    study_year_id,
    theme_id,
    themes,
    difficulty,
    taskType,
    labels,
    language
  ) => ({
    status: correctStatus,
    subject_id,
    study_year_id,
    is_test_assignment: true,
    type: taskType,
    theme: themes.find((theme) => theme.id === theme_id),
    theme_id,
    difficulty,
    labels: labels.map(({ name }) => name),
    interface_language: language.title,
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

guard({
  clock: updateAssignment.doneData,
  filter: $redirectAfterSave,
  target: navigatePush.prepend(() => ({ name: 'test-tasks-list' })),
})

sample({
  clock: duplicateAssignment,
  source: { id: $taskId, count: $count },
  fn: (data: { id: number; count: number }) => {
    return {
      assignments: [data.id],
      number_of_duplicates: data.count,
    }
  },
  target: duplicateTestAssignment,
})

forward({
  from: duplicateTestAssignment.doneData,
  to: [successToastEvent('Задание было успешно продублировано!'), setCount.prepend(() => 0)],
})
