<template>
  <div class="tree-node">
    <div
      :id="`node-${$props.nodeId}`"
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
        v-else-if="!opened && node.element_type !== 'assignment'"
        :type="node.is_prerequisite ? 'folder-prerequisite' : 'tree-folder'"
        :class="{ 'folder-icon': true, transparent: node.is_prerequisite }"
        size="35"
      />
      <div
        v-else
        class="fake-icon"
      >
        <Icon
          :type="taskIcon"
          size="20"
          class="icon"
        />
      </div>
      <div
        v-if="node.element_type === 'assignment'"
        class="assignment-features"
      >
        <div class="id-wrapper">
          ({{ node.assignment.id }})
        </div>
      </div>
      <span>{{ title }}</span>
      <div
        v-if="node.element_type === 'assignment'"
        class="status-wrapper"
      >
        {{ correctStatus }}
      </div>
      <Chip
        v-if="node.element_type !== 'assignment'"
        primary
        :item="resources.tasks"
        icon="copy"
      />
      <Actions
        :id="node.assignment && node.assignment.id || node.ordering_number"
        :is-folder="showActions"
        :selected="[]"
        class="action"
        @onRemove="(val) => handleRemove(val)"
        @onPreview="(val) => $emit('onPreview', val)"
        @onEdit="(val) => $emit('onEdit', val)"
        @onDuplicate="val => $emit('onDuplicate', val)"
        @onDuplicateNTimes="val => $emit('onDuplicateNTimes', val)"
        @onCreateFolder="createFolder"
        @onCreateTask="createTask"
        @onEditFolder="editFolder"
        @onDeleteFolder="deleteFolder"
      />
    </div>
    <div v-if="opened" class="leaf">
      <TreeNode
        v-for="leaf in node.leaves"
        :key="leaf[leaf.element_type].id"
        :node="leaf"
        :node-id="leaf[leaf.element_type].id || leaf[leaf.element_type].name"
        :prerequisite-folder="$props.prerequisiteFolder"
        :filters="filters"
        @loadTree="val => $emit('loadTree', val)"
        @onRightClick="handleRightClick"
        @onRemove="(val) => $emit('onRemove', val)"
        @onPreview="(val) => $emit('onPreview', val)"
        @onEdit="(val) => $emit('onEdit', val)"
        @onDuplicate="val => $emit('onDuplicate', val)"
        @onDuplicateNTimes="val => $emit('onDuplicateNTimes', val)"
      />
    </div>
    <ContextMenu
      v-if="showContextMenu"
      :id="$props.nodeId"
      :selected="[]"
      :style="contextMenuStyles"
      type='folder'
      class="context-menu"
      @onOutsideClick="showContextMenu = false"
      @onCreateFolder="createFolder"
      @onCreateTask="createTask"
      @onEditFolder="editFolder"
      @onDeleteFolder="deleteFolder"
      @onDuplicate="val => $emit('onDuplicate', val)"
      @onDuplicateNTimes="val => $emit('onDuplicateNTimes', val)"
    />
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import Chip from '@/pages/dictionary/themes/list/parts/themes-tree/parts/Chip.vue'
import Actions from '@/pages/bank/lesson-tasks/list/parts/table/Actions.vue'
import { TreeData } from '@/features/api/types'
import { mapTaskTypeTo } from '@/pages/common/constants'
import { removeHtmlTags } from '@/features/lib'
import {
  modalVisibilityChanged as createFolderModal,
  loadFolder,
} from '@/pages/common/modals/tasks-bank/creating-folder/creating-folder-modal.model'
import {
  modalVisibilityChanged as editFolderModal,
  loadFolder as loadParentFolder,
} from '@/pages/common/modals/tasks-bank/editing-folder/editing-folder-modal.model'
import { mapTaskStatus } from '@/pages/common/parts/status-controller/constants'
import { setDataToUpdateTree } from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'
import {
  setDeleteType,
  loadConfirmDeleteModal,
} from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { $session } from '@/features/session'
import { loadRequestDeleteModal } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import ContextMenu from '@/pages/bank/lesson-tasks/list/parts/table/ContextMenu.vue'
import AutoOpenFolderMixin from '@/features/lib/mixins/AutoOpenFolderMixin'
import { FiltersParams } from '@/pages/common/types'

export default AutoOpenFolderMixin({
  filters: {
    id: (item, search) => !!item.assignment?.id.toString().includes(search),
    folder: (item, search) => {
      return !!item.folder?.name.toLowerCase().includes(search.toLowerCase())
    },
    wording: (item, search) =>
      !!item.assignment?.wording.toLowerCase().includes(search.toLowerCase()),
    score: (item, search) => !!item.assignment?.score.toString().includes(search),
    course: (item, search) => !!item.assignment?.course.toString().includes(search),
    created_by: (item, search) =>
      !!item.assignment?.created_by.first_name?.toLowerCase().includes(search) ||
      !!item.assignment?.created_by.last_name?.toLowerCase().includes(search) ||
      !!item.assignment?.created_by.id?.toString().includes(search),
  },
}).extend({
  name: 'TreeNode',
  components: {
    Icon,
    Chip,
    Actions,
    ContextMenu,
  },
  effector: {
    $session,
  },
  props: {
    node: { type: Object as PropType<TreeData> },
    parent: { type: Boolean, default: false },
    prerequisiteFolder: { type: Boolean, default: false },
    nodeId: { type: Number },
    filters: { type: Object as PropType<FiltersParams> },
  },
  data: () => ({
    opened: false,
    showContextMenu: false,
    contextMenuStyles: { top: '0', left: '0' },
    searchString: '',
  }),
  computed: {
    title(): string {
      const type = this.node.element_type
      let fullName = ''
      if (type !== 'assignment' && type !== 'study_resource' && type !== 'media') {
        const entity = this.node[type]
        fullName = entity && entity.name ? entity.name : ''
        if (fullName.length > 100) {
          fullName = `${fullName.slice(0, 100)}...`
        }
      } else if (type !== 'study_resource' && type !== 'media') {
        const entity = this.node[type]
        fullName = entity ? entity.wording : ''
        if (!entity?.wording) return ''
        fullName = removeHtmlTags(fullName)
        fullName = `${fullName.slice(0, 30)}...`
      }
      return fullName
    },
    resources(): Record<string, { count: number; description: string }> {
      return {
        tasks: {
          count: this.node.leaves.filter((el) => el.element_type === 'assignment').length,
          description: 'Количество заданий в папке',
        },
      }
    },
    taskIcon(): string {
      return mapTaskTypeTo[this.node.assignment!.type].icon
    },
    correctStatus(): string {
      return mapTaskStatus[this.node.assignment!.status]
    },
    showActions(): boolean {
      const { element_type } = this.$props.node
      return element_type === 'folder'
    },
  },
  methods: {
    createFolderModal,
    toggle(evt: any) {
      if (evt.target.closest('.action') || this.node.element_type === 'assignment') return
      if (!this.opened && this.node.element_type === 'folder') {
        const { id } = this.node[this.node.element_type]!
        this.$emit('loadTree', {
          folder: id,
          is_prerequisite: this.prerequisiteFolder ? true : undefined,
        })
      }
      this.opened = !this.opened
    },
    handleRemove(val: number[]) {
      this.setDataForTree()
      this.$emit('onRemove', val)
    },
    handleRightClick(event: any) {
      if (event instanceof MouseEvent) event.preventDefault()
      let type = this.$props.node.element_type

      if (type === 'folder' && event instanceof MouseEvent) {
        this.showContextMenu = true
        return
      }

      if (type === 'folder' && event instanceof Object) {
        this.$emit('onRightClick', event)
        return
      }

      if (this.$props.node[type].is_prerequisite) {
        if (this.$props.prerequisiteFolder) {
          type = 'prerequisite_own'
        } else {
          type = 'prerequisite_general'
        }
      }
      this.setDataForTree()
      this.$emit('onRightClick', {
        data: {
          id: this.$props.nodeId,
          isTheme: this.$props.node.element_type === 'theme',
        },
        event,
        type,
      })
    },
    setDataForTree() {
      const { folder } = this.node
      if (folder) {
        setDataToUpdateTree({
          folder: folder.id,
        })
      }
    },
    createFolder() {
      loadFolder(this.nodeId)
      createFolderModal(true)
    },
    editFolder() {
      loadParentFolder(this.nodeId)
      editFolderModal(true)
    },
    deleteFolder() {
      setDeleteType('folder')
      this.$session?.permissions?.assignments_assignment?.delete
        ? loadConfirmDeleteModal([this.nodeId])
        : loadRequestDeleteModal([this.nodeId])
    },
    createTask() {
      loadFolder(this.nodeId)
      this.$router.push({ name: 'lesson-tasks-creation' })
    },
  },
  mounted() {
    const { element_type } = this.$props.node
    if (element_type === 'assignment' || element_type === 'folder') {
      const nodeElement = document.querySelector(`#node-${this.$props.nodeId}`)
      nodeElement && nodeElement.addEventListener('contextmenu', this.handleRightClick)
    }
    if (this.filters.search) {
      const searchString = this.filters.search_area
        ? this.filters.search_area.slice(this.filters.search_area?.indexOf('_') + 1)
        : ''
      this.searchString = searchString === 'search_wording' ? 'assignment' : searchString
      this.autoOpenFolders([this.node])
    }
  },
  beforeDestroy() {
    const { element_type } = this.$props.node
    if (element_type === 'assignment' || element_type === 'folder') {
      const nodeElement = document.querySelector(`#node-${this.$props.nodeId}`)
      nodeElement && nodeElement.removeEventListener('contextmenu', this.handleRightClick)
    }
  },
})
</script>

<style scoped>
.tree-node {
  position: relative;
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
.chip {
  @mixin flex-row-central;
  padding: 4px 8px;
  font-weight: 600;
  line-height: 14px;
  border-radius: 40px;
  background-color: var(--c-grey-3);
  margin-left: 5px;
  color: #fff;
  & ::v-deep span {
    margin-left: 5px;
  }
}

.primary {
  background-color: var(--c-yellow-1);
  margin-left: 15px;
}

.chip-icon {
  fill: #fff;
}
.assignment-features {
  display: contents;
}
.fake-icon {
  width: 30px;
  height: 30px;
  background: #fff;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  @mixin flex-center;
  margin-right: 15px;
  .icon {
    fill: transparent;
    stroke: var(--c-dark-0);
  }
}
.status-wrapper {
  height: 20px;
  @mixin flex-center;
  padding: 0 10px;
  box-sizing: border-box;
  border-radius: 40px;
  line-height: 14px;
  font-weight: 600;
  color: #fff;
  margin-right: 15px;
  &.--green {
    background-color: var(--c-green-0);
  }
  &.--yellow {
    background-color: var(--c-yellow-0);
  }
  &.--red {
    background-color: var(--c-red-2);
  }
}
.id-wrapper {
  margin-right: 15px;
  line-height: 14px;
  font-weight: 600;
}
.status-wrapper {
  margin-left: 10px;
  margin-right: 0;
  color: var(--base-text-primary);
  background-color: var(--c-grey-8);
}
.action {
  margin-left: 10px;
}
.context-menu {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
