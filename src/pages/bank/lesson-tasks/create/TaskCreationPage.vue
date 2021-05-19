<template>
  <div class="test-task-creation">
    <TaskHeader
      title="Создание урочного задания"
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
import TaskContent from '@/pages/bank/lesson-tasks/create/parts/Content.vue'
import TaskFooter from '@/pages/bank/common/parts/Footer.vue'
import {
  save,
  $canSave,
  clearFields,
  setRedirectAfterSave,
} from '@/pages/bank/lesson-tasks/create/task-creation-page.model'
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
  beforeDestroy() {
    clearFields()
    resetCounters()
  },
})
</script>

