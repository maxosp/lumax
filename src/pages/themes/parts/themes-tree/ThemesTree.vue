<template>
  <div class="themes-tree">
    <TreeNode
      v-for="leaf in $themesTree"
      :key="leaf[leaf.element_type].id"
      :node="leaf"
      parent
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TreeNode from '@/pages/themes/parts/themes-tree/parts/TreeNode.vue'
import { $themesTree } from '@/pages/themes/themes-page.model'

export default Vue.extend({
  name: 'ThemesTree',
  components: {
    TreeNode,
  },
  effector: { $themesTree },
})
</script>

<style scoped>
.themes-tree {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  padding: 30px;
}
</style>
