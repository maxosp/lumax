<template>
  <NoDataContent
    v-if="$filesTree && !$filesTree.length"
    @resetFilters="$emit('resetFilter')"
  />
  <div
    v-else
    class="tree-wrapper"
  >
    <TreeHeader :total="correctTotal" />
    <div class="files-tree">
      <TreeNode
        v-for="leaf in $filesTree"
        :key="leaf[leaf.element_type].id"
        :node-id="leaf[leaf.element_type].id || leaf[leaf.element_type].name"
        :node="leaf"
        :show-paste="showPaste"
        parent
        :prerequisite-folder="leaf.element_type === 'virtual_folder'"
        @loadTree="val => $emit('loadTree', val)"
        @onRightClick="$emit('onRightClick', $event)"
        @onRemove="val => $emit('onRemove', val)"
        @onCreate="val => $emit('onCreate', val)"
        @onUpload="val => $emit('onUpload', val)"
        @onRename="val => $emit('onRename', val)"
        @onCopy="val => $emit('onCopy', val)"
        @onPaste="val => $emit('onPaste', val)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TreeNode from '@/pages/dictionary/files/parts/tree/parts/TreeNode.vue'
import { $filesTree, $filesTreeTotal } from '@/pages/dictionary/files/system-files-page.model'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import TreeHeader from '@/pages/common/parts/tree/TreeHeader.vue'
import { formatFilesTitle } from '@/features/lib'

export default Vue.extend({
  name: 'FilesTree',
  components: {
    TreeNode,
    NoDataContent,
    TreeHeader,
  },
  props: {
    showPaste: { type: Boolean },
  },
  effector: { $filesTree, $filesTreeTotal },
  computed: {
    correctTotal() {
      return formatFilesTitle(this.$filesTreeTotal)
    },
  },
})
</script>

<style scoped>
.files-tree {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  padding: 30px;
}
</style>
