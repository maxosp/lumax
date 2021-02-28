<template>
  <div class="test-task-creation">
    <TaskHeader />
    <TaskContent />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TaskHeader from '@/pages/bank/lesson-tasks/create/parts/Header.vue'
import TaskContent from '@/pages/bank/lesson-tasks/create/parts/Content.vue'

export default Vue.extend({
  name: 'TaskCreationPage',
  components: {
    TaskHeader,
    TaskContent,
  },
})
</script>

