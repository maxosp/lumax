import { attach, combine, createEvent, restore, sample } from 'effector-root'
import { $session } from '@/features/session'
import { createAssignmentFx } from '@/features/api/assignment/create-assignment'
import { $themesData } from '@/pages/bank/test-tasks/create/parts/themes-dropdown/themes-dropdown.model'
import {
  $isFilled as $isFilledBroadFile,
  $form as $formBroadFile,
} from '@/pages/bank/test-tasks/create/tasks/BroadFileAnswer/broad-file-answer.model'
import {
  $isFilled as $isFilledBroadOpen,
  $form as $formBroadOpen,
} from '@/pages/bank/test-tasks/create/tasks/BroadOpenAnswer/broad-open-answer.model'
import {
  $isFilled as $isFilledColorHighlight,
  $form as $formColorHighlight,
} from '@/pages/bank/test-tasks/create/tasks/ColorHighlightAnswer/color-highlight-answer.model'
import {
  $isFilled as $isFilledCommonListString,
  $form as $formCommonListString,
} from '@/pages/bank/test-tasks/create/tasks/CommonListStringAnswer/common-list-string-answer.model'
import {
  $isFilled as $isFilledCommonListText,
  $form as $formCommonListText,
} from '@/pages/bank/test-tasks/create/tasks/CommonListTextAnswer/common-list-text-answer.model'
import {
  $isFilled as $isFilledConnectLines,
  $form as $formConnectLines,
} from '@/pages/bank/test-tasks/create/tasks/ConnectLinesAnswer/connect-lines-answer.model'
import {
  $isFilled as $isFilledCorrectSequence,
  $form as $formCorrectSequence,
} from '@/pages/bank/test-tasks/create/tasks/CorrectSequenceAnswer/correct-sequence-answer.model'
import {
  $isFilled as $isFilledMultipleChoiceOne,
  $form as $formMultipleChoiceOne,
} from '@/pages/bank/test-tasks/create/tasks/MultipleChoiceOneAnswer/multiple-choice-one-answer.model'
import {
  $isFilled as $isFilledMultipleChoiceOneOrMany,
  $form as $formMultipleChoiceOneOrMany,
} from '@/pages/bank/test-tasks/create/tasks/MultipleChoiceOneOrManyAnswers/multiple-choice-one-or-many-answers.model'
import {
  $isFilled as $isFilledMultipleListText,
  $form as $formMultipleListText,
} from '@/pages/bank/test-tasks/create/tasks/MultipleListTextAnswer/multiple-list-text-answer.model'
import {
  $isFilled as $isFilledMultipleShortClosed,
  $form as $formMultipleShortClosed,
} from '@/pages/bank/test-tasks/create/tasks/MultipleShortClosedAnswer/multiple-short-closed-answer.model'
import {
  $isFilled as $isFilledShortClosed,
  $form as $formShortClosed,
} from '@/pages/bank/test-tasks/create/tasks/ShortClosedAnswer/short-closed-answer.model'
import { mapTaskTypeToComponent } from '@/pages/bank/test-tasks/create/parts/task-types-dropdown/constants'

const createAssignment = attach({
  effect: createAssignmentFx,
})

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

export const save = createEvent<void>()

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
})

const $baseForm = combine(
  $theme,
  $themesData,
  $difficulty,
  $taskType,
  $session,
  $needDuplicate,
  $count,
  (theme_id, themes, difficulty, taskType, user, needDuplicate, count) => ({
    status: 'new',
    is_test_assignment: true,
    creation_datetime: new Date(),
    created_by: user,
    type: taskType,
    theme: themes.find((theme) => theme.id === theme_id),
    theme_id,
    difficulty,
    ...(needDuplicate ? { duplicate_count: count } : {}),
  })
)

const $generalForm = combine($baseForm, $taskType, $taskform, (baseForm, taskType, taskform) => {
  const form = taskType ? taskform[mapTaskTypeToComponent[taskType]] : {}
  return {
    ...baseForm,
    ...form,
  }
})

sample({
  source: $generalForm,
  clock: save,
  fn: (form) => form,
  target: createAssignment,
})
