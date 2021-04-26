<template>
  <NoDataContent
    v-if="$tagsTree && !$tagsTree.length"
    @resetFilters="$emit('resetFilters')"
  />
  <div
    v-else
    class="tags-tree"
  >
    <TreeNode
      v-for="leaf in $tagsTree"
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
import TreeNode from '@/pages/tags/parts/tree/TreeNode.vue'
import { $tagsTree, $isLoading } from '@/pages/tags/tags-page.model'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'

export default Vue.extend({
  name: 'TagsTree',
  components: {
    NoDataContent,
    TreeNode,
  },
  effector: { $tagsTree, $isLoading },
})
</script>

<style scoped>
.tags-tree {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  padding: 30px;
}
</style>
