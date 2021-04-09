<template>
  <div class="test-task-creation">
    <TaskHeader
      title="Редактирование олимпиадного задания"
      :disabled="!$canSave"
      :is-preview="$isPreview"
      :status="$status"
      class="header"
      @toggle="toggleIsPreview"
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
import TaskContent from '@/pages/bank/olympiad-tasks/edit/parts/Content.vue'
import TaskFooter from '@/pages/bank/common/parts/Footer.vue'
import {
  save,
  $canSave,
  clearFields,
  loadTask,
  setRedirectAfterSave,
  $isPreview,
  toggleIsPreview,
  $taskId,
  $status,
} from '@/pages/bank/olympiad-tasks/edit/task-edition-page.model'
import { $token } from '@/features/api/common/request'

export default Vue.extend({
  name: 'TaskEditionPage',
  components: {
    TaskHeader,
    TaskContent,
    TaskFooter,
  },
  effector: {
    $canSave,
    $isPreview,
    $taskId,
    $status,
    $token,
  },
  watch: {
    $isPreview: {
      handler(newVal) {
        if (newVal) {
          this.$router.push({
            name: 'preview-task',
            query: {
              questions: `${this.$taskId}`,
              type: 'olympiad-assignment',
              token: this.$token,
              application: 'true',
            },
          })
        }
      },
    },
  },
  methods: {
    toggleIsPreview,
    saveTask(isRedirect: boolean) {
      save()
      if (isRedirect) setRedirectAfterSave(true)
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

<style scoped>
.header ::v-deep .bottom .buttons {
  display: none;
}
</style>
