<template>
  <div class="test-task-creation">
    <TaskHeader
      title="Создание тестового задания"
      :disabled="!$canSave"
      @save="saveTask(false)"
      @saveAndBackToList="saveTask(true)"
    />
    <TaskContent />
    <TaskFooter
      :disabled="!$canSave"
      @save="saveTask(false)"
      @saveAndBackToList="saveTask(true)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TaskHeader from '@/pages/bank/common/parts/Header.vue'
import TaskContent from '@/pages/bank/test-tasks/create/parts/Content.vue'
import TaskFooter from '@/pages/bank/common/parts/Footer.vue'
import {
  save,
  $canSave,
  setSubject,
  setClass,
  setTheme,
  setRedirectAfterSave,
  clearFields,
} from '@/pages/bank/test-tasks/create/task-creation-page.model'
import {
  setSelectedSubject,
  subjectsDropdownModule,
} from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import {
  classesDropdownModule,
  setSelectedClass,
} from '@/pages/common/dropdowns/class/classes-dropdown.model'
import { themesDropdownModule } from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'
import { resetCounters } from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/form/moving-images-on-image-answer-form.model'

export default Vue.extend({
  name: 'TaskCreationPage',
  components: {
    TaskHeader,
    TaskContent,
    TaskFooter,
  },
  effector: {
    $canSave,
  },
  methods: {
    saveTask(isRedirect: boolean) {
      save()
      if (isRedirect) setRedirectAfterSave(true)
    },
  },
  mounted() {
    if (this.$route.params) {
      const { subject, studyYear, theme } = this.$route.params
      subject && subjectsDropdownModule.methods.itemChanged(subject)
      subject && setSelectedSubject({ name: subject, title: '' })
      setSubject(+subject)
      studyYear && classesDropdownModule.methods.itemChanged(studyYear)
      studyYear && setSelectedClass({ name: studyYear, title: '' })
      setClass(+studyYear)
      theme && themesDropdownModule.methods.itemChanged(theme)
      setTheme(+theme)
    }
  },
  beforeDestroy() {
    clearFields()
    resetCounters()
  },
})
</script>

