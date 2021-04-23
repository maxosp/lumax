<template>
  <NoDataContent
    v-if="$resourcesTree && !$resourcesTree.length"
    @resetFilters="$emmit('resetFilters')"
  />
  <div
    v-else
    class="tree-wrapper"
  >
    <TreeHeader :total="correctTotal" />
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TreeNode from '@/pages/dictionary/resources/list/parts/tree/parts/TreeNode.vue'
import {
  $resourcesTree,
  $resourcesTreeTotal,
} from '@/pages/dictionary/resources/list/resources-page.model'
import TreeHeader from '@/pages/common/parts/tree/TreeHeader.vue'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import { formatResourcesTitle } from '@/features/lib'

export default Vue.extend({
  name: 'ResourcesTree',
  components: {
    TreeNode,
    TreeHeader,
    NoDataContent,
  },
  effector: { $resourcesTree, $resourcesTreeTotal },
  computed: {
    correctTotal() {
      return formatResourcesTitle(this.$resourcesTreeTotal)
    },
  },
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
