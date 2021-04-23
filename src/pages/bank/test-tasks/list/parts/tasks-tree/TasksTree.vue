<template>
  <NoDataContent
    v-if="$tasksTree && !$tasksTree.length"
    @resetFilters="$emit('resetFilter')"
  />
  <div
    v-else
    class="tree-wrapper"
  >
    <div class="tasks-tree">
      <TreeNode
        v-for="leaf in $tasksTree"
        :key="leaf[leaf.element_type].id"
        :node-id="leaf[leaf.element_type].id || leaf[leaf.element_type].name"
        :node="leaf"
        parent
        :prerequisite-folder="leaf.element_type === 'virtual_folder'"
        @onRightClick="$emit('onRightClick', $event)"
        @onRemoveTask="val => $emit('onRemoveTask', val)"
        @onRemoveTheme="val => $emit('onRemoveTheme', val)"
        @onPreview="val => $emit('onPreview', val)"
        @loadTree="val => $emit('loadTree', val)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TreeNode from '@/pages/bank/test-tasks/list/parts/tasks-tree/parts/TreeNode.vue'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import { $tasksTree } from '@/pages/bank/test-tasks/list/tasks-page.model'

export default Vue.extend({
  name: 'TasksTree',
  components: {
    TreeNode,
    NoDataContent,
  },
  effector: { $tasksTree },
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
