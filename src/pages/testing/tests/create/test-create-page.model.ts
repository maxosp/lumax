import { attach, combine, createEffect, createEvent, forward, restore, sample } from 'effector'
import {
  $finalTextDropdowns,
  checkFinalTextFormValid,
  $finalTextFormValid,
  clearFields as finalTextFormClearFields,
} from '@/pages/common/parts/tests/parts/final-text-form/final-text-form.model'
import {
  $isFilled as $isFilledAutomaticGenerationForm,
  $form as $formAutomaticGeneration,
  clearFields as automaticGenerationFormClearFields,
} from '@/pages/common/parts/tests/automatic-generation/automatic-generation-form.model'
import { createTestFx } from '@/features/api/test/create-test'
import {
  CreateTestAutoItemFxParams,
  CreateTestFinalTextFxParams,
  CreateTestFxParams,
} from '@/features/api/test/types'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { createTestAutoItemFx } from '@/features/api/test/create-test-auto-item'
import { createTestFinalTextFx } from '@/features/api/test/create-test-final-text'

import { typeDropdownModule } from '@/pages/common/dropdowns/testing/type-dropdown/type-dropdown.model'
import {
  classesDropdownModule,
  setSelectedClass,
} from '@/pages/common/dropdowns/class/classes-dropdown.model'
import { subjectsDropdownModule } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { condition } from 'patronum'
import { navigatePush } from '@/features/navigation'
import { DropdownItem } from '@/pages/common/types'

const createTest = attach({
  effect: createTestFx,
})

const createTestAutoItem = attach({
  effect: createTestAutoItemFx,
})

const createTestAutoItemList = createEffect<any>((data: CreateTestAutoItemFxParams[]) => {
  data.forEach((item: CreateTestAutoItemFxParams) => createTestAutoItem(item))
})

const createTestFinalText = attach({
  effect: createTestFinalTextFx,
})

const createTestFinalTextList = createEffect<any>((data: CreateTestFinalTextFxParams[]) => {
  data.forEach((item: CreateTestFinalTextFxParams) => createTestFinalText(item))
})

export const trySave = createEvent<void>()
export const save = createEvent<void>()
export const clearFields = createEvent<void>()

export const setRedirectAfterSave = createEvent<boolean>()
const $redirectAfterSave = restore(setRedirectAfterSave, false).reset(clearFields)

export const setTestType = createEvent<string>()
export const $testType = restore(setTestType, null).reset(clearFields)

export const toggleFilterByStudyYear = createEvent<boolean>()
export const $filterByStudyYear = restore(toggleFilterByStudyYear, true).reset(clearFields)

export const toggleArchive = createEvent<boolean>()
export const $archive = restore(toggleArchive, false).reset(clearFields)

export const setStudyYear = createEvent<DropdownItem | null>()
export const $studyYear = restore(setStudyYear, null).reset(clearFields)

export const setSubject = createEvent<DropdownItem>()
export const $subject = restore(setSubject, null).reset(clearFields)

export const setWording = createEvent<string>()
export const $wording = restore(setWording, '').reset(clearFields)

export const setContaining = createEvent<string>()
export const $containing = restore(setContaining, '').reset(clearFields)

export const toggleTestScope = createEvent<string>()
export const $testScope = restore(toggleTestScope, '0').reset(clearFields)

export const setCMSComment = createEvent<string>()
export const $cmsComment = restore(setCMSComment, '').reset(clearFields)

export const toggleTestAccess = createEvent<boolean>()
export const $testAccess = restore(toggleTestAccess, false).reset(clearFields)

export const toggleTimeLimit = createEvent<boolean>()
export const $timeLimit = restore(toggleTimeLimit, false).reset(clearFields)

export const setMaxTime = createEvent<number>()
export const $maxTime = restore(setMaxTime, null).reset(clearFields)

forward({
  from: toggleFilterByStudyYear,
  to: [
    setStudyYear.prepend(() => null),
    setSelectedClass.prepend(() => null),
    classesDropdownModule.methods.resetDropdown,
  ],
})

const $baseForm = combine(
  $subject,
  $formAutomaticGeneration,
  $testType,
  $filterByStudyYear,
  $wording,
  $containing,
  $cmsComment,
  $maxTime,
  $studyYear,
  (
    selectedSubject,
    formAutomaticGeneration,
    testType,
    filterByStudyYear,
    wording,
    containing,
    cmsComment,
    maxTime,
    selectedClass
  ): CreateTestFxParams => ({
    name: wording,
    instruction: containing,
    cms_comment: cmsComment,
    generator: Number(testType),
    difficulty: formAutomaticGeneration.difficulty,
    duration_min: maxTime,
    filter_by_year: filterByStudyYear,
    study_year_id: selectedClass ? +selectedClass : null,
    subject_id: +selectedSubject!,
  })
)

export const $canSave = combine(
  $isFilledAutomaticGenerationForm,
  $formAutomaticGeneration,
  $testType,
  $subject,
  $wording,
  $containing,
  $finalTextDropdowns,
  (isFilled, form, testType, subject, wording, containing, finalTextValid) => {
    return (
      isFilled &&
      form.auto_items.length > 1 &&
      testType &&
      subject &&
      wording &&
      containing &&
      finalTextValid
    )
  }
)

forward({
  from: trySave,
  to: checkFinalTextFormValid,
})

sample({
  source: $finalTextFormValid,
  clock: checkFinalTextFormValid,
  fn: (res) => {
    if (res) {
      save()
    }
  },
})

sample({
  source: $baseForm,
  clock: save,
  target: createTest,
})

sample({
  source: $finalTextDropdowns,
  clock: createTest.doneData,
  fn: (dropdowns, response) => dropdowns.map((item) => ({ ...item, test_id: response.body.id })),
  target: createTestFinalTextList,
})

sample({
  source: $formAutomaticGeneration,
  clock: createTest.doneData,
  fn: (form, response) => form.auto_items.map((item) => ({ ...item, test_id: response.body.id })),
  target: createTestAutoItemList,
})

forward({
  from: createTestAutoItemList.doneData,
  to: [successToastEvent('Тест успешно создан!'), clearFields],
})

forward({
  from: clearFields,
  to: [
    typeDropdownModule.methods.resetDropdown,
    classesDropdownModule.methods.resetDropdown,
    subjectsDropdownModule.methods.resetDropdown,
    automaticGenerationFormClearFields,
    finalTextFormClearFields,
  ],
})

const $redirectHandler = sample({
  clock: createTest.doneData.map((res) => res.body.id!),
  source: $redirectAfterSave,
  fn: (redirect, id) => ({ redirect, id }),
})

condition({
  source: $redirectHandler,
  if: (payload: { redirect: boolean; id: number }) => payload.redirect,
  then: navigatePush.prepend(() => ({ name: 'tests-list' })),
  else: navigatePush.prepend((payload: { redirect: boolean; id: number }) => ({
    name: 'test-creation-page',
    params: { id: `${payload.id}` },
  })),
})
