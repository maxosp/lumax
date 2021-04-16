<template>
  <NoDataContent
    v-if="$labelsTree && !$labelsTree.length"
    @resetFilters="$emit('resetFilter')"
  />
  <div
    v-else
    class="tree-wrapper"
  >
    <TreeHeader :total="correctTotal" />
    <div class="labels-tree">
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TreeNode from '@/pages/labels/parts/tree/TreeNode.vue'
import { $labelsTree, $labelsTreeTotal } from '@/pages/labels/labels-page.model'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import TreeHeader from '@/pages/common/parts/tree/TreeHeader.vue'
import { formatLabelsTitle } from '@/features/lib'

export default Vue.extend({
  name: 'LabelsTree',
  components: {
    TreeNode,
    NoDataContent,
    TreeHeader,
  },
  effector: { $labelsTree, $labelsTreeTotal },
  computed: {
    correctTotal() {
      return formatLabelsTitle(this.$labelsTreeTotal)
    },
  },
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
