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

import {
  $selectedTags,
  getTags,
  resetSelectedTags,
  setSelectedTagsIds,
} from '@/pages/bank/olympiad-tasks/edit/parts/tags-dropdown/tags-dropdown.model'

import { successToastEvent } from '@/features/toasts/toasts.model'

import { AssignmentAudioFile } from '@/features/api/assignment/types'
import { AudioFile } from '@/pages/common/parts/tasks/types'
import { navigatePush } from '@/features/navigation'
import { DropdownItem } from '@/pages/common/types'
import { LANGUAGE_DATA } from '@/pages/bank/common/constants'
import { mapTaskTypeTo } from '@/pages/common/constants'
import { condition, debounce } from 'patronum'
import { classesDropdownModule } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import { subjectsDropdownModule } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { scoreDropdownModule } from '@/pages/common/dropdowns/bank/olympiad-tasks/score-dropdown/score-dropdown.model'
import { updateOlympiadAssignmentFx } from '@/features/api/assignment/olympiad-assignment/update-olympiad-assignment'
import { getOlympiadAssignmentFx } from '@/features/api/assignment/olympiad-assignment/get-olympiad-assignment'
import { taskTypesDropdownModule } from '@/pages/common/dropdowns/bank/task-types-dropdown/task-types-dropdown.model'
import { resetHintsList } from '@/pages/common/parts/tasks/parts/add-hints-block/add-hints-block.model'
import {
  $correctStatus,
  setIsArchive,
  setIsPublished,
  setStatus,
} from '@/pages/common/parts/status-controller/status.model'

const updateAssignment = attach({
  effect: updateOlympiadAssignmentFx,
})
export const loadAssignment = attach({
  effect: getOlympiadAssignmentFx,
})

export const loadTask = createEvent<number>()
export const $taskId = restore(loadTask, 0)

export const setSubject = createEvent<number | null>()
export const $subject = restore(setSubject, null)

export const setClass = createEvent<number | null>()
export const $class = restore(setClass, null)

export const setScore = createEvent<number | null>()
export const $score = restore(setScore, null)

export const setTaskType = createEvent<string | null>()
export const $taskType = restore(setTaskType, null)

export const setLanguage = createEvent<DropdownItem>()
export const $language = restore(setLanguage, LANGUAGE_DATA[0])

export const setAudioIds = createEvent<AssignmentAudioFile[]>()
export const $audioIds = restore(setAudioIds, [])

export const showSolutionEnabledChanged = createEvent<boolean>()
export const $showSolutionEnabled = restore(showSolutionEnabledChanged, false)
// TO DO add to form
export const setSolutionText = createEvent<string>()
export const $solutionText = restore(setSolutionText, '')

export const save = createEvent<void>()
export const clearFields = createEvent<void>()

export const toggleIsPreview = createEvent<boolean>()
export const $isPreview = restore(toggleIsPreview, false).reset(clearFields)

export const setRedirectAfterSave = createEvent<boolean>()
const $redirectAfterSave = restore(setRedirectAfterSave, false).reset(clearFields)

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
    scoreDropdownModule.methods.resetDropdown,
    taskTypesDropdownModule.methods.resetDropdown,
    setTaskType.prepend(() => null),
    resetHintsList,
    resetSelectedTags,
  ],
})

forward({
  from: loadTask,
  to: loadAssignment,
})

forward({
  from: loadAssignment.doneData.map((res) => res.body),
  to: [
    subjectsDropdownModule.methods.itemChanged.prepend((data) => `${data.subject.id}`),
    setSubject.prepend((data) => data.subject.id || 0),
    classesDropdownModule.methods.itemChanged.prepend((data) => `${data.study_year.id}`),
    setClass.prepend((data) => data.study_year.id || 0),
    scoreDropdownModule.methods.itemChanged.prepend((data) => `${data.score}`),
    setScore.prepend((data) => data.score || 0),
    taskTypesDropdownModule.methods.itemChanged.prepend((data) => data.type),
    setTaskType.prepend((data) => data.type),
    setLanguage.prepend((data) => ({
      name: data.interface_language,
      title: data.interface_language,
    })),
    setSelectedTagsIds.prepend((data) => data.tags),
    setSolutionText.prepend((data) => data.answer_text),
    setStatus.prepend((data) => data.status),
    // setHint.prepend((data) => data.clue.map((hint) => ({ text: hint.name, price: hint.price. }))),
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
})

const $baseForm = combine(
  $correctStatus,
  $subject,
  $class,
  $score,
  $taskType,
  $selectedTags,
  $language,
  (correctStatus, subject_id, study_year_id, score, taskType, tags, language) => ({
    status: correctStatus,
    type: taskType,
    subject_id,
    study_year_id,
    score,
    tags: tags.map(({ name }) => name),
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
  target: navigatePush.prepend(() => ({ name: 'olympiad-tasks-list' })),
})
