<template>
  <NoDataContent
    v-if="$lessonsTree && !$lessonsTree.length"
    @resetFilters="$emit('resetFilter')"
  />
  <div
    v-else
    class="tree-wrapper"
  >
    <div class="tasks-tree">
      <TreeNode
        v-for="leaf in $lessonsTree"
        :key="leaf[leaf.element_type].id"
        :node-id="leaf[leaf.element_type].id || leaf[leaf.element_type].name"
        :node="leaf"
        parent
        :prerequisite-folder="leaf.element_type === 'virtual_folder'"
        @loadTree="val => $emit('loadTree', val)"
        @onRightClick="$emit('onRightClick', $event)"
        @onRemove="$emit('onRemove', val)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TreeNode from '@/pages/bank/lesson-tasks/list/parts/lessons-tree/TreeNode.vue'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import { $lessonsTree } from '@/pages/bank/lesson-tasks/list/lesson-page.model'

export default Vue.extend({
  name: 'TasksTree',
  components: {
    TreeNode,
    NoDataContent,
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
