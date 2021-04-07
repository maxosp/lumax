<template>
  <NoDataContent
    v-if="$labelsTree && !$labelsTree.length"
    @resetFilters="$emit('resetFilter')"
  />
  <div
    v-else
    class="labels-tree"
  >
    <TreeNode
      v-for="leaf in $labelsTree"
      :key="leaf[leaf.element_type].id"
      :node-id="leaf[leaf.element_type].id || leaf[leaf.element_type].name"
      :node="leaf"
      parent
      :prerequisite-folder="leaf.element_type === 'virtual_folder'"
      @loadTree="val => $emit('loadTree', val)"
      @onRightClick="$emit('onRightClick', $event)"
      @onRemove="val => $emit('onRemove', val)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TreeNode from '@/pages/labels/parts/tree/TreeNode.vue'
import { $labelsTree } from '@/pages/labels/labels-page.model'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'

export default Vue.extend({
  name: 'LabelsTree',
  components: {
    TreeNode,
    NoDataContent,
  },
  effector: { $labelsTree },
})
</script>

<style scoped>
.labels-tree {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  padding: 30px;
}
</style>
