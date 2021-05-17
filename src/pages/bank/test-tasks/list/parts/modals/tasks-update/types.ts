import { SwitchersOptionsType } from '@/pages/bank/test-tasks/list/parts/modals/tasks-update/parts/switchers/types'

export type TaskUpdateForm = {
  $tasksIds: string
  $switchers?: SwitchersOptionsType
  $selectedDifficulty?: string
  $selectedModerator?: string
}
