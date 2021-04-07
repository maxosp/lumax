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

import { successToastEvent } from '@/features/toasts/toasts.model'

import { AssignmentAudioFile } from '@/features/api/assignment/types'
import { AudioFile } from '@/pages/common/parts/tasks/types'
import { navigatePush } from '@/features/navigation'
import { DropdownItem } from '@/pages/common/types'
import { LANGUAGE_DATA } from '@/pages/bank/common/constants'
import { mapTaskTypeTo } from '@/pages/common/constants'
import { taskTypesDropdownModule } from '@/pages/common/dropdowns/bank/task-types-dropdown/task-types-dropdown.model'
import {
  $selectedFolder,
  foldersDropdownModule,
  setSelectedFolder,
} from '@/pages/common/dropdowns/bank/position-dropdown/position-dropdown.model'
import { getLessonAssignmentFx } from '@/features/api/assignment/lesson-assignment/get-lesson-assignment'
import { updateLessonAssignmentFx } from '@/features/api/assignment/lesson-assignment/update-lesson-assignment'
import { updateLessonAssignmentBulkFx } from '@/features/api/assignment/lesson-assignment/update-lesson-assignment-bulk'
import { condition } from 'patronum'

const updateAssignment = attach({
  effect: updateLessonAssignmentFx,
})
export const loadAssignment = attach({
  effect: getLessonAssignmentFx,
})

export const duplicateLessonAssignment = attach({
  effect: updateLessonAssignmentBulkFx,
})

export const loadTask = createEvent<number>()
export const $taskId = restore(loadTask, 0)

export const setFolder = createEvent<number | null>()
export const $folder = restore(setFolder, null)

export const setScore = createEvent<number | null>()
export const $score = restore(setScore, null)

export const setTaskType = createEvent<string | null>()
export const $taskType = restore(setTaskType, null)

export const setLanguage = createEvent<DropdownItem>()
export const $language = restore(setLanguage, LANGUAGE_DATA[0])

export const setAudioIds = createEvent<AssignmentAudioFile[]>()
export const $audioIds = restore(setAudioIds, [])

export const setCount = createEvent<number>()
export const $count = restore(setCount, 0)

export const setStatus = createEvent<string | null>()
export const $status = restore(setStatus, null)

export const setIsArchive = createEvent<boolean>()
export const $isArchive = restore(setIsArchive, false)

export const setIsPublished = createEvent<boolean>()
export const $isPublished = restore(setIsPublished, false)

export const save = createEvent<void>()
export const clearFields = createEvent<void>()

export const setRedirectAfterSave = createEvent<boolean>()
const $redirectAfterSave = restore(setRedirectAfterSave, false).reset(clearFields)

export const duplicateAssignment = createEvent<void>()

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
  from: loadTask,
  to: loadAssignment,
})

forward({
  from: clearFields,
  to: [
    taskTypesDropdownModule.methods.resetDropdown,
    setTaskType.prepend(() => null),
    foldersDropdownModule.methods.resetDropdown,
  ],
})
forward({
  from: loadAssignment.doneData.map((res) => res.body),
  to: [
    foldersDropdownModule.methods.itemChanged.prepend((data) => `${data.folder.id}`),
    setFolder.prepend((data) => data.folder.id || 0),
    setScore.prepend((data) => data.score || 0),
    taskTypesDropdownModule.methods.itemChanged.prepend((data) => data.type),
    setTaskType.prepend((data) => data.type),
    setLanguage.prepend((data) => ({
      name: data.interface_language,
      title: data.interface_language,
    })),
    setSelectedFolder.prepend((data) => ({ title: `${data.folder.id}`, name: data.folder.name })),
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
})

export const $canSave = combine(
  $folder,
  $score,
  $taskType,
  $isFilled,
  (folder, score, taskType, isFilled) => {
    const isFilledTask = taskType && isFilled[mapTaskTypeTo[taskType].componentName]
    return isFilledTask && folder && score
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
  $selectedFolder,
  $folder,
  $score,
  $taskType,
  $language,
  (correctStatus, folder, folder_id, score, taskType, language) => ({
    status: correctStatus,
    folder,
    folder_id,
    type: taskType,
    score,
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
            }).then((r) => r.body)
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
    const form = taskType ? taskform[mapTaskTypeTo[taskType].componentName] : {}
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
        audios_ids: audioFiles.map(({ media }) => media),
      },
    }
  },
  target: updateAssignment,
})

forward({
  from: updateAssignment.doneData.map((res) => res.body.id),
  to: successToastEvent('Задание успешно сохранено!'),
})

guard({
  clock: updateAssignment.doneData,
  filter: $redirectAfterSave,
  target: navigatePush.prepend(() => ({ name: 'lesson-tasks-list' })),
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
  target: duplicateLessonAssignment,
})

forward({
  from: duplicateLessonAssignment.doneData,
  to: [successToastEvent('Задание было успешно продублировано!'), setCount.prepend(() => 0)],
})
