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
import { navigatePush } from '@/features/navigation'
import TaskHeader from '@/pages/bank/common/parts/Header.vue'
import TaskContent from '@/pages/bank/lesson-tasks/create/parts/Content.vue'
import TaskFooter from '@/pages/bank/common/parts/Footer.vue'
import {
  save,
  $canSave,
  clearFields,
} from '@/pages/bank/lesson-tasks/create/task-creation-page.model'

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
      if (isRedirect) {
        navigatePush({ name: 'lesson-tasks-list' })
      }
    },
  },
  beforeDestroy() {
    clearFields()
  },
})
</script>

