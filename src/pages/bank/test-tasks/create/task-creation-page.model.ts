import { attach, combine, createEffect, createEvent, forward, restore, sample } from 'effector-root'
import { createTestAssignmentFx } from '@/features/api/assignment/test-assignment/create-test-assignment'
import { uploadAudioFx } from '@/features/api/assignment/audio/upload-audio'
import { $themesData } from '@/pages/bank/test-tasks/create/parts/themes-dropdown/themes-dropdown.model'
import {
  $isFilled as $isFilledBroadFile,
  $form as $formBroadFile,
} from '@/pages/bank/test-tasks/tasks/broad-file-answer/broad-file-answer.model'
import {
  $isFilled as $isFilledBroadOpen,
  $form as $formBroadOpen,
} from '@/pages/bank/test-tasks/tasks/broad-open-answer/broad-open-answer.model'
import {
  $isFilled as $isFilledColorHighlight,
  $form as $formColorHighlight,
} from '@/pages/bank/test-tasks/tasks/color-highlight-answer/color-highlight-answer.model'
import {
  $isFilled as $isFilledCommonListString,
  $form as $formCommonListString,
} from '@/pages/bank/test-tasks/tasks/common-list-string-answer/common-list-string-answer.model'
import {
  $isFilled as $isFilledCommonListText,
  $form as $formCommonListText,
} from '@/pages/bank/test-tasks/tasks/common-list-text-answer/common-list-text-answer.model'
import {
  $isFilled as $isFilledConnectLines,
  $form as $formConnectLines,
} from '@/pages/bank/test-tasks/tasks/connect-lines-answer/connect-lines-answer.model'
import {
  $isFilled as $isFilledCorrectSequence,
  $form as $formCorrectSequence,
} from '@/pages/bank/test-tasks/tasks/correct-sequence-answer/correct-sequence-answer.model'
import {
  $isFilled as $isFilledMultipleChoiceOne,
  $form as $formMultipleChoiceOne,
} from '@/pages/bank/test-tasks/tasks/multiple-choice-one-answer/multiple-choice-one-answer.model'
import {
  $isFilled as $isFilledMultipleChoiceOneOrMany,
  $form as $formMultipleChoiceOneOrMany,
} from '@/pages/bank/test-tasks/tasks/multiple-choice-one-or-many-answers/multiple-choice-one-or-many-answers.model'
import {
  $isFilled as $isFilledMultipleListText,
  $form as $formMultipleListText,
} from '@/pages/bank/test-tasks/tasks/multiple-list-text-answer/multiple-list-text-answer.model'
import {
  $isFilled as $isFilledMultipleShortClosed,
  $form as $formMultipleShortClosed,
} from '@/pages/bank/test-tasks/tasks/multiple-short-closed-answer/multiple-short-closed-answer.model'
import {
  $isFilled as $isFilledShortClosed,
  $form as $formShortClosed,
} from '@/pages/bank/test-tasks/tasks/short-closed-answer/short-closed-answer.model'
import {
  $isFilled as $isFilledMovingOnImage,
  $form as $formMovingOnImage,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/moving-images-on-image-answer.model'
import {
  $isFilled as $isFilledMovingOnText,
  $form as $formMovingOnText,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-text-input-answer/moving-images-on-text-input-answer.model'
import { $selectedLabels } from '@/pages/bank/test-tasks/create/parts/labels-dropdown/labels-dropdown.model'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { mapTaskTypeToComponent } from '@/pages/bank/test-tasks/create/parts/task-types-dropdown/constants'
import { AssignmentAudioFile } from '@/features/api/assignment/types'
import { AudioFile } from '@/pages/bank/test-tasks/tasks/types'
import { navigatePush } from '@/features/navigation'

const createTestAssignment = attach({
  effect: createTestAssignmentFx,
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

export const setAudioIds = createEvent<AssignmentAudioFile[]>()
export const $audioIds = restore(setAudioIds, [])

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
            }).then((r) => r.body)
            resolve(res)
          })
      )
    ),
})

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
      audios_ids: audioFiles.map(({ media }) => media),
    }
  },
  target: createTestAssignment,
})

forward({
  from: createTestAssignment.doneData,
  to: [
    successToastEvent('Задание успешно создано!'),
    // @ts-ignore
    navigatePush.prepend((res) => ({ name: 'test-tasks-edit', params: { id: res.body.id } })),
  ],
})
