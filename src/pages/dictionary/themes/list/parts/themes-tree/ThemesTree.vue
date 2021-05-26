<template>
  <NoDataContent
    v-if="$themesTree && !$themesTree.length"
    @resetFilters="$emit('resetFilter')"
  />
  <div
    v-else
    class="themes-tree"
  >
    <TreeNode
      v-for="leaf in $themesTree"
      :key="leaf[leaf.element_type].id"
      :node-id="leaf[leaf.element_type].id || leaf[leaf.element_type].name"
      :node="leaf"
      parent
      :filters="filters"
      :prerequisite-folder="leaf.virtual_folder && leaf.virtual_folder.code === 'prerequisite'"
      @onRightClick="$emit('onRightClick', $event)"
      @loadTree="val => $emit('loadTree', val)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TreeNode from '@/pages/dictionary/themes/list/parts/themes-tree/parts/TreeNode.vue'
import { $themesTree } from '@/pages/dictionary/themes/list/themes-page.model'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import { FiltersParams } from '@/pages/common/types'

export default Vue.extend({
  name: 'ThemesTree',
  components: {
    TreeNode,
    NoDataContent,
  },
  props: {
    filters: { type: Object as PropType<FiltersParams> },
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
