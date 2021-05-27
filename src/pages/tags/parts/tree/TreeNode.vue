<template>
  <div class="tree-node">
    <div
      :id="`node-${$props.nodeId}`"
      class="label"
      @click="toggle($event)"
    >
      <Icon
        v-if="opened && node.element_type !== 'olympiad_tag'"
        type="tree-folder-opened"
        class="folder-icon"
        size="35"
      />
      <Icon
        v-else-if="!opened && node.element_type !== 'olympiad_tag'"
        type="tree-folder"
        :class="{ 'folder-icon': true }"
        size="35"
      />
      <div v-else class="fake-icon">
        <span> # </span>
      </div>
      <span>{{ title }}</span>
      <div
        v-if="!parent"
        class="chips"
      >
        <Chip
          v-if="node.element_type === 'olympiad_tag'"
          primary
          :item="resources.tasks"
          icon="copy"
        />
        <Chip
          v-if="node.element_type !== 'olympiad_tag'"
          :item="resources.tags"
        />
      </div>
      <Actions
        v-if="showActions"
        :id="node.olympiad_tag && node.olympiad_tag.id || node.study_year.id"
        :is-study-year="node.element_type === 'study_year'"
        :selected="[]"
        class="action"
        :data-to-create-tag="dataToCreateTag"
        @onEdit="(val) => loadModalToEdit(val)"
        @showTasks="(val) => loadModal(val)"
        @create="(val) => createTagFromTree(val)"
        @onRemove="val => handleOnRemove(val)"
      />
    </div>
    <div v-if="opened" class="leaf">
      <TreeNode
        v-for="(leaf, index) in node.leaves"
        :key="leaf[leaf.element_type] && leaf[leaf.element_type].id || index"
        :node="leaf"
        :node-id="leaf[leaf.element_type] && leaf[leaf.element_type].id || leaf[leaf.element_type].name "
        :prerequisite-folder="$props.prerequisiteFolder"
        :filters="filters"
        @onRightClick="$emit('onRightClick', $event)"
        @loadTree="val => $emit('loadTree', val)"
        @onRemove="val => $emit('onRemove', val)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import Chip from '@/pages/tags/parts/tree/Chip.vue'
import Actions from '@/pages/tags/parts/table/Actions.vue'
import { TreeData } from '@/features/api/types'
import { loadModalToEdit } from '@/pages/tags/parts/modals/tag-edition/tag-edition.modal'
import { loadModal } from '@/pages/tags/parts/modals/tasks/tasks.model'
import { createTagFromTree } from '@/pages/tags/parts/modals/tag-creation/tag-creation.modal'
import { sortTreeLeaves } from '@/features/lib'
import { setDataToUpdateTree } from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'
import AutoOpenFolderMixin from '@/features/lib/mixins/AutoOpenFolderMixin'
import { FiltersParams } from '@/pages/common/types'

export default AutoOpenFolderMixin({
  filters: {
    name: (item, search) => !!item.olympiad_tag?.name.toLowerCase().includes(search.toLowerCase()),
    study_year: (item, search) =>
      !!item.study_year?.name.toLowerCase().includes(search.toLowerCase()),
    subject: (item, search) => !!item.subject?.name.toLowerCase().includes(search.toLowerCase()),
  },
}).extend({
  name: 'TreeNode',
  components: {
    Icon,
    Chip,
    Actions,
  },
  props: {
    node: { type: Object as PropType<TreeData> },
    parent: { type: Boolean, default: false },
    prerequisiteFolder: { type: Boolean, default: false },
    nodeId: { type: [Number, String] },
    filters: { type: Object as PropType<FiltersParams> },
  },
  data: () => ({
    opened: false,
  }),
  computed: {
    title() {
      const type = this.node.element_type
      let fullName = ''
      if (type !== 'assignment' && type !== 'study_resource' && type !== 'media') {
        const entity = this.node[type]
        fullName = entity ? entity.name : ''
        if (fullName.length > 100) {
          fullName = `${fullName.slice(0, 100)}...`
        }
      }
      return fullName
    },
    resources() {
      return {
        tasks: {
          count: this.node.olympiad_tag ? this.node.olympiad_tag.assignments_count : null,
          description: 'Количество заданий',
        },
        tags: {
          count: this.node.leaves.filter((el) => el.element_type === 'olympiad_tag').length,
          description: 'Количество тегов',
        },
      }
    },
    dataToCreateTag() {
      const { study_year } = this.$props.node
      if (study_year)
        return {
          class_id: study_year.id,
          subject_id: study_year.subject_id,
        }
      return null
    },
    showActions() {
      const { element_type } = this.$props.node
      return element_type === 'olympiad_tag' || element_type === 'study_year'
    },
    nodeLeavesLength(): number {
      return this.node.leaves.length
    },
  },
  watch: {
    opened: {
      handler(newVal) {
        if (newVal) this.node.leaves = sortTreeLeaves(this.node.leaves)
      },
    },
    nodeLeavesLength: {
      handler(newVal) {
        if (newVal && this.opened) this.node.leaves = sortTreeLeaves(this.node.leaves)
      },
    },
  },
  methods: {
    loadModalToEdit,
    loadModal,
    createTagFromTree,
    toggle(evt: any) {
      if (evt.target.closest('.action') || this.node.element_type === 'olympiad_tag') return
      if (!this.node.leaves.length && this.node.element_type === 'study_year') {
        const { subject_id, id } = this.node[this.node.element_type]!
        this.$emit('loadTree', { subject: subject_id, study_year: id })
      }
      this.opened = !this.opened
    },
    handleRightClick(event: any) {
      event.preventDefault()
      let type = this.$props.node.element_type

      if (this.$props.node[type].is_prerequisite) {
        if (this.$props.prerequisiteFolder) {
          type = 'prerequisite_own'
        } else {
          type = 'prerequisite_general'
        }
      }
      const obj = {}
      if (this.$props.node.element_type === 'study_year')
        Object.assign(obj, { subject_id: this.$props.node.study_year.subject_id })
      this.setDataForTree()
      this.$emit('onRightClick', {
        data: { id: this.$props.nodeId, ...obj },
        event,
        type,
      })
    },
    showTasks() {
      this.$emit('tasks', this.$props.node.olympiad_tag.id)
    },
    handleOnRemove(val: number[]) {
      this.$emit('onRemove', val)
      this.setDataForTree()
    },
    setDataForTree() {
      if (this.node.olympiad_tag) {
        setDataToUpdateTree({
          subject: this.node.olympiad_tag.subject_id,
          study_year: this.node.olympiad_tag.study_year_id,
        })
      }
    },
  },
  mounted() {
    const type = this.$props.node.element_type
    if (type === 'study_year' || type === 'olympiad_tag') {
      const nodeElement = document.querySelector(`#node-${this.$props.nodeId}`)
      nodeElement && nodeElement.addEventListener('contextmenu', this.handleRightClick)
    }
    if (this.filters.search) {
      this.searchString = this.filters.search_area
        ? this.filters.search_area.slice(this.filters.search_area?.indexOf('_') + 1)
        : ''
      this.autoOpenFolders([this.node])
    }
  },
  beforeDestroy() {
    const type = this.$props.node.element_type
    if (type === 'study_year' || type === 'olympiad_tag') {
      const nodeElement = document.querySelector(`#node-${this.$props.nodeId}`)
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
.chip {
  min-width: 24px;
  padding: 4px 8px;
  box-sizing: border-box;
  font-weight: 600;
  line-height: 14px;
  border-radius: 40px;
  background-color: var(--c-grey-3);
  margin-left: 5px;
  color: #fff;
}

.primary {
  background-color: var(--c-yellow-1);
  margin-left: 15px;
}

.chip-icon {
  fill: #fff;
}
.fake-icon {
  width: 30px;
  height: 30px;
  @mixin flex-center;
  background: #fff;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  margin-right: 15px;
  span {
    display: block;
    font-size: 20px;
    line-height: 14px;
    font-weight: 700;
    color: var(--c-yellow-1);
  }
}
.action {
  margin-left: 10px;
}
</style>
