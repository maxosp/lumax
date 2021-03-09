<template>
  <div
    v-if="$tagsTree && !$tagsTree.length"
    class="no-data-content"
  >
    Теги не найдены.
  </div>
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
      @onRightClick="$emit('onRightClick', $event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TreeNode from '@/pages/tags/parts/tree/TreeNode.vue'
import { $tagsTree } from '@/pages/tags/tags-page.model'

export default Vue.extend({
  name: 'TagsTree',
  components: {
    TreeNode,
  },
  effector: { $tagsTree },
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
