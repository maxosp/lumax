<template>
  <div class="test-task-creation">
    <TaskHeader
      title="Создание тестового задания"
      @save="updateSubject(false)"
      @saveAndBackToList="updateSubject(true)"
    />
    <TaskContent />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TaskHeader from '@/pages/bank/test-tasks/common/Header.vue'
import TaskContent from '@/pages/bank/test-tasks/create/parts/Content.vue'
import { save } from '@/pages/bank/test-tasks/create/task-creation-page.model'

export default Vue.extend({
  name: 'TaskCreationPage',
  components: {
    TaskHeader,
    TaskContent,
  },
  methods: {
    // changeIfRedirect,
    save,
    updateSubject(isRedirect: boolean) {
      // changeIfRedirect(isRedirect)
      console.log(isRedirect)
      save()
    },
  },
})
</script>

