<template>
  <div class="tree-node">
    <div
      :id="`node-${$props.nodeId}`"
      class="label"
      @click="toggle($event)"
    >
      <Icon
        v-if="opened"
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
        @onRemove="(val) => loadModalToDelete(val)"
        @onEdit="(val) => loadModalToEdit(val)"
        @showTasks="(val) => loadModal(val)"
        @create="(val) => createTagFromTree(val)"
      />
    </div>
    <div v-if="opened" class="leaf">
      <TreeNode
        v-for="(leaf, index) in node.leaves"
        :key="leaf[leaf.element_type] && leaf[leaf.element_type].id || index"
        :node="leaf"
        :node-id="leaf[leaf.element_type] && leaf[leaf.element_type].id || leaf[leaf.element_type].name "
        :prerequisite-folder="$props.prerequisiteFolder"
        @onRightClick="$emit('onRightClick', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import Chip from '@/pages/tags/parts/tree/Chip.vue'
import Actions from '@/pages/tags/parts/table/Actions.vue'
import { TreeData } from '@/features/api/types'
import { loadModalToDelete } from '@/pages/tags/parts/modals/tag-deletion/tag-deletion.model'
import { loadModalToEdit } from '@/pages/tags/parts/modals/tag-edition/tag-edition.modal'
import { loadModal } from '@/pages/tags/parts/modals/tasks/tasks.model'
import { createTagFromTree } from '@/pages/tags/parts/modals/tag-creation/tag-creation.modal'

export default Vue.extend({
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
  },
  data() {
    return {
      opened: false,
    }
  },
  computed: {
    title() {
      const entity = this.node[this.node.element_type]
      let fullName = entity ? entity.name : ''
      if (fullName.length > 100) {
        fullName = `${fullName.slice(0, 100)}...`
      }
      return fullName
    },
    resources() {
      return {
        tasks: {
          // @ts-ignore
          count: this.node.olympiad_tag ? this.node.olympiad_tag.assignments_count : null,
          description: 'Количество заданий',
        },
        tags: {
          // @ts-ignore
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
  },
  methods: {
    loadModalToDelete,
    loadModalToEdit,
    loadModal,
    createTagFromTree,
    toggle(evt: any) {
      if (evt.target.closest('.action')) return
      // @ts-ignore
      if (this.node.leaves && this.node.leaves.length) {
        // @ts-ignore
        this.opened = !this.opened
        // @ts-ignore
        this.node.leaves = this.node.leaves.sort(
          (a: TreeData, b: TreeData) => a.ordering_number - b.ordering_number
        )
      }
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
      this.$emit('onRightClick', {
        data: { id: this.$props.nodeId, ...obj },
        event,
        type,
      })
    },
    removeSelected() {
      this.$emit('onRemove', this.$props.node.olympiad_tag.id)
    },
    editTag() {
      this.$emit('onEdit', this.$props.node.olympiad_tag.id)
    },
    showTasks() {
      this.$emit('tasks', this.$props.node.olympiad_tag.id)
    },
  },
  mounted() {
    // @ts-ignore
    const type = this.$props.node.element_type
    // @ts-ignore
    if (type === 'study_year' || type === 'olympiad_tag') {
      // @ts-ignore
      const nodeElement = document.querySelector(`#node-${this.$props.nodeId}`)
      // @ts-ignore
      nodeElement && nodeElement.addEventListener('contextmenu', this.handleRightClick)
    }
  },
  beforeDestroy() {
    // @ts-ignore
    const type = this.$props.node.element_type
    if (type === 'study_year' || type === 'olympiad_tag') {
      // @ts-ignore
      const nodeElement = document.querySelector(`#node-${this.$props.nodeId}`)
      // @ts-ignore
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
