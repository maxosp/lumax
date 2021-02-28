<template>
  <div class='content'>
    <div class='form'>
      <TaskTypesDropdown class="field" />
      <TagsDropdown class="field" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TaskTypesDropdown from '@/pages/bank/olympiad-tasks/create/parts/task-types-dropdown/TaskTypesDropdown.vue'
import TagsDropdown from '@/pages/bank/olympiad-tasks/create/parts/tags-dropdown/TagsDropdown.vue'
import {
  setTheme,
  $needDuplicate,
  toggleNeedDuplicate,
  $count,
  setCount,
} from '@/pages/bank/test-tasks/create/task-creation-page.model'

export default Vue.extend({
  name: 'TaskContent',
  components: {
    TaskTypesDropdown,
    TagsDropdown,
  },
  effector: {
    $needDuplicate,
    $count,
  },
  methods: {
    setTheme,
    toggleNeedDuplicate,
    setCount,
  },
})
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  padding: 30px;
  background-color: #fff;
  border-radius: 3px;
}
.form {
  display: flex;
  flex-direction: column;
  width: 60%;
}
.field {
  margin-bottom: 20px;
}
</style>