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
import TaskContent from '@/pages/bank/test-tasks/edit/parts/Content.vue'
import TaskFooter from '@/pages/bank/common/parts/Footer.vue'
import {
  save,
  $canSave,
  loadTask,
  setRedirectAfterSave,
  clearFields,
} from '@/pages/bank/test-tasks/edit/task-edition-page.model'

export default Vue.extend({
  name: 'TaskEditionPage',
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
        setRedirectAfterSave(true)
      }
    },
  },
  beforeDestroy() {
    clearFields()
  },
  created() {
    loadTask(+this.$route.params.id)
  },
})
</script>

