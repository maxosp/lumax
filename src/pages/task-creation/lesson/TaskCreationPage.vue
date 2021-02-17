<template>
  <div class="test-task-creation">
    <TaskHeader />
    <TaskContent />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TaskHeader from '@/pages/task-creation/lesson/parts/Header.vue'
import TaskContent from '@/pages/task-creation/lesson/parts/Content.vue'

export default Vue.extend({
  name: 'TaskCreationPage',
  components: {
    TaskHeader,
    TaskContent,
  },
})
</script>

