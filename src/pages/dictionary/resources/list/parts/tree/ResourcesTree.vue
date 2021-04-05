<template>
  <div class="resources-tree">
    <TreeNode
      v-for="leaf in $resourcesTree"
      :key="leaf[leaf.element_type].id"
      :node-id="leaf[leaf.element_type].id || leaf[leaf.element_type].name"
      :node="leaf"
      parent
      :prerequisite-folder="leaf.element_type === 'virtual_folder'"
      @onRightClick="$emit('onRightClick', $event)"
      @loadTree="val => $emit('loadTree', val)"
      @onRemove="val => $emit('onRemove', val)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TreeNode from '@/pages/dictionary/resources/list/parts/tree/parts/TreeNode.vue'
import { $resourcesTree } from '@/pages/dictionary/resources/list/resources-page.model'

export default Vue.extend({
  name: 'ResourcesTree',
  components: {
    TreeNode,
  },
  effector: { $resourcesTree },
})
</script>

<style scoped>
.resources-tree {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  padding: 30px;
}
</style>
