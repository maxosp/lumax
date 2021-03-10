<template>
  <div class="tasks-tree">
    <TreeNode
      v-for="leaf in $lessonsTree"
      :key="leaf[leaf.element_type].id"
      :node-id="leaf[leaf.element_type].id || leaf[leaf.element_type].name"
      :node="leaf"
      parent
      :prerequisite-folder="leaf.element_type === 'virtual_folder'"
      @onRightClick="$emit('onRightClick', $event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TreeNode from '@/pages/bank/test-tasks/list/parts/tasks-tree/parts/TreeNode.vue'
import { $lessonsTree } from '@/pages/bank/lesson-tasks/list/lesson-page.model'

export default Vue.extend({
  name: 'TasksTree',
  components: {
    TreeNode,
  },
  effector: { $lessonsTree },
})
</script>

<style scoped>
.tasks-tree {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  padding: 30px;
}
</style>
