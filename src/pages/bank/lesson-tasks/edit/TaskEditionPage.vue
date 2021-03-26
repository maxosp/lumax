<template>
  <div class="test-task-creation">
    <TaskHeader
      title="Редактирование урочного задания"
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
import TaskContent from '@/pages/bank/lesson-tasks/edit/parts/Content.vue'
import TaskFooter from '@/pages/bank/common/parts/Footer.vue'
import {
  save,
  $canSave,
  clearFields,
  loadTask,
} from '@/pages/bank/lesson-tasks/edit/task-edition-page.model'

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
  created() {
    loadTask(+this.$route.params.id)
  },
  beforeDestroy() {
    clearFields()
  },
})
</script>

