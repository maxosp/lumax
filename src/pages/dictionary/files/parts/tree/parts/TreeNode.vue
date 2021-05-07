<template>
  <div class="tree-node">
    <div
      :id="`node-${node.element_type}-${nodeId}`"
      class="label"
      @click="toggle"
    >
      <Icon
        v-if="opened"
        type="tree-folder-opened"
        class="folder-icon"
        size="35"
      />
      <Icon
        v-else-if="!opened && node.element_type !== 'media'"
        type="tree-folder"
        :class="{ 'folder-icon': true }"
        size="35"
      />
      <div v-else-if="!opened && node.element_type === 'media'" class="fake-icon">
        {{ extension }}
      </div>
      <span>{{ title }}</span>
      <Actions
        v-if="showActions"
        :id="node.media && node.media.id || node.folder.id"
        :is-folder="node.element_type === 'folder'"
        :show-paste="showPaste"
        class="action"
        @onRemove="handleOnRemove"
        @onCreate="handleCreate"
        @onUpload="handleOnUpload"
        @onRename="handleRename"
        @onCopy="handleCopy"
        @onPaste="handleOnPaste"
      />
    </div>
    <div v-if="opened" class="leaf">
      <TreeNode
        v-for="(leaf, index) in node.leaves"
        :key="`${leaf.element_type}-${leaf[leaf.element_type].id || index}`"
        :node="leaf"
        :node-id="leaf[leaf.element_type] && leaf[leaf.element_type].id || leaf[leaf.element_type].name "
        :prerequisite-folder="$props.prerequisiteFolder"
        @onRightClick="$emit('onRightClick', $event)"
        @loadTree="val => $emit('loadTree', val)"
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
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import Actions from '@/pages/dictionary/files/parts/tree/parts/Actions.vue'
import { TreeData } from '@/features/api/types'
import { loadModal } from '@/pages/labels/parts/modals/tasks/tasks.model'
import { loadModalToEdit } from '@/pages/labels/parts/modals/label-edition/label-edition.modal'
import { createLabelFromTree } from '@/pages/labels/parts/modals/label-creation/label-creation.model'
import { sortTreeLeaves } from '@/features/lib'
import { setDataToUpdateTree } from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'
import { FolderType } from '@/features/api/assignment/types'
import { UploadMediaResponse } from '@/features/api/media/types'
import { loadConfirmDeleteModal } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'

export default Vue.extend({
  name: 'TreeNode',
  components: {
    Icon,
    Actions,
  },
  props: {
    node: { type: Object as PropType<TreeData> },
    parent: { type: Boolean, default: false },
    prerequisiteFolder: { type: Boolean, default: false },
    nodeId: { type: [Number, String] },
    showPaste: { type: Boolean },
  },
  data: () => ({
    opened: false,
  }),
  computed: {
    title() {
      const entity = this.node[this.node.element_type]
      let fullName = ''
      if (this.node.element_type === 'folder' || this.node.element_type === 'media')
        fullName =
          (entity && ((entity as FolderType).name || (entity as UploadMediaResponse).file_name)) ||
          ''
      if (fullName.length > 100) {
        fullName = `${fullName.slice(0, 100)}...`
      }
      return fullName
    },
    showActions() {
      const { element_type } = this.$props.node
      return ['media', 'folder'].includes(element_type)
    },
    extension() {
      return this.node.media.file_name.slice(this.node.media.file_name.lastIndexOf('.') + 1)
    },
  },
  watch: {
    opened: {
      handler(newVal) {
        if (newVal) this.node.leaves = sortTreeLeaves(this.node.leaves)
      },
    },
  },
  methods: {
    loadModal,
    loadModalToEdit,
    createLabelFromTree,
    loadConfirmDeleteModal,
    toggle(evt: any) {
      if (evt.target.closest('.action') || this.node.element_type === 'media') return
      if (!this.opened && this.node.element_type === 'folder') {
        const { id } = this.node[this.node.element_type]!
        this.$emit('loadTree', { folder: id })
      }
      this.opened = !this.opened
    },
    handleRightClick(event: any) {
      event.preventDefault()
      const type = this.$props.node.element_type
      this.setDataForTree()
      this.$emit('onRightClick', {
        data: {
          id: this.$props.nodeId,
          isFolder: this.$props.node.element_type === 'folder',
        },
        event,
        type,
      })
    },
    handleOnRemove(val: number[]) {
      this.$emit('onRemove', val)
      this.setDataForTree()
    },
    handleOnUpload(val: number) {
      this.$emit('onUpload', val)
      this.setDataForTree()
    },
    handleCreate(val: { id: number; type: string }) {
      this.$emit('onCreate', val)
      this.setDataForTree()
    },
    handleOnCopyFolder(val: number) {
      this.$emit('onCopyFolder', val)
      this.setDataForTree()
    },
    handleRename(val: { id: number; type: string }) {
      this.$emit('onRename', val)
      this.setDataForTree()
    },
    handleCopy(val: { id: number; type: string }) {
      this.$emit('onCopy', val)
      this.setDataForTree()
    },
    handleOnPaste(val: { id: number; type: string }) {
      this.$emit('onPaste', val)
      this.setDataForTree()
    },
    setDataForTree() {
      const id =
        this.node.element_type === 'media'
          ? this.node.media.folder_id
          : this.node.folder!.parent_id || this.nodeId
      setDataToUpdateTree({
        folder: +id!,
      })
    },
  },
  mounted() {
    if (['folder', 'media'].includes(this.node.element_type)) {
      const nodeElement = document.querySelector(`#node-${this.node.element_type}-${this.nodeId}`)
      nodeElement && nodeElement.addEventListener('contextmenu', this.handleRightClick)
    }
  },
  beforeDestroy() {
    if (['folder', 'media'].includes(this.node.element_type)) {
      const nodeElement = document.querySelector(`#node-${this.node.element_type}-${this.nodeId}`)
      nodeElement && nodeElement.removeEventListener('contextmenu', this.handleRightClick)
    }
  },
})
</script>

<style scoped>
.tree-node {
  padding-top: 20px;
}
.folder-icon {
  stroke: var(--c-grey-3);
  margin-right: 15px;
  &.transparent {
    opacity: 0.5;
  }
}
.label {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 600;
  line-height: 14px;
  color: var(--base-text-primary);
}
.leaf {
  display: flex;
  flex-direction: column;
  padding-left: 50px;
  & ~ .leaf {
    padding-left: 50px;
  }
}
.primary {
  background-color: var(--c-yellow-1);
  margin-left: 15px;
}

.fake-icon {
  width: 30px;
  height: 30px;
  @mixin flex-center;
  background: #fff;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  margin-right: 15px;
  color: var(--c-red-1);
}
.action {
  margin-left: 10px;
}
</style>
