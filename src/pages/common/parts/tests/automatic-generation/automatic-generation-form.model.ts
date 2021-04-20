import { combine, createEvent, forward, restore } from 'effector'
import {
  $selectedThemes,
  resetThemes,
} from '@/pages/common/parts/tests/automatic-generation/parts/themes-dropdown/themes-dropdown.model'
import { difficultyDropdownModule } from '@/pages/common/dropdowns/testing/difficulty-dropdown/difficulty-dropdown.model'

export const clearFields = createEvent<void>()

export const changeDifficulty = createEvent<number>()
export const $difficulty = restore(changeDifficulty, 0).reset(clearFields)

export const togglePrerequisites = createEvent<boolean>()
export const $prerequisites = restore(togglePrerequisites, false).reset(clearFields)

export const $isFilled = combine(
  $difficulty,
  $selectedThemes,
  (difficulty, themes) => difficulty && themes && themes.length > 1
)

export const $form = combine(
  $difficulty,
  $prerequisites,
  $selectedThemes,
  (difficulty, prerequisites, themes) => ({
    difficulty,
    prerequisites,
    auto_items: themes.map((theme) => ({
      theme: {
        name: theme.title,
        study_year: theme.study_year,
        subject: theme.subject,
      },
      order_number: theme.id,
      theme_id: theme.name,
    })),
  })
).reset(clearFields)

forward({
  from: clearFields,
  to: [difficultyDropdownModule.methods.resetDropdown, resetThemes],
})
