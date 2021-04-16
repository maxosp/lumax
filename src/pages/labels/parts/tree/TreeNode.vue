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
        v-else-if="!opened && node.element_type !== 'label'"
        type="tree-folder"
        :class="{ 'folder-icon': true }"
        size="35"
      />
      <div v-else class="fake-icon">
        <div class="circle" />
      </div>
      <span>{{ title }}</span>
      <div
        v-if="!parent"
        class="chips"
      >
        <Chip
          v-if="node.element_type === 'label'"
          primary
          :item="resources.tasks"
          icon="copy"
        />
        <Chip
          v-if="node.element_type !== 'label'"
          :item="resources.labels"
        />
      </div>
      <Actions
        v-if="showActions"
        :id="node.label && node.label.id || node.theme.id"
        :data-to-create-label="dataToCreateLabel"
        :is-theme="node.element_type === 'theme'"
        :selected="[]"
        class="action"
        @onRemove="(val) => handleOnRemove(val)"
        @onEdit="(val) => loadModalToEdit(val)"
        @showTasks="(val) => loadModal(val)"
        @create="(val) => createLabelFromTree(val)"
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
        @loadTree="val => $emit('loadTree', val)"
        @onRemove="(val) => $emit('onRemove', val)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import Chip from '@/pages/labels/parts/tree/Chip.vue'
import Actions from '@/pages/tags/parts/table/Actions.vue'
import { TreeData } from '@/features/api/types'
import { loadModal } from '@/pages/labels/parts/modals/tasks/tasks.model'
import { loadModalToEdit } from '@/pages/labels/parts/modals/label-edition/label-edition.modal'
import { createLabelFromTree } from '@/pages/labels/parts/modals/label-creation/label-creation.model'
import { sortTreeLeaves } from '@/features/lib'
import { setDataToUpdateTree } from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'

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
  data: () => ({
    opened: false,
  }),
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
          count: this.node.label ? this.node.label.assignments_count : null,
          description: 'Количество заданий',
        },
        labels: {
          count: this.node.leaves.filter((el) => el.element_type === 'label').length,
          description: 'Количество меток',
        },
      }
    },
    showActions() {
      const { element_type } = this.$props.node
      return ['label', 'theme'].includes(element_type)
    },
    dataToCreateLabel() {
      const { theme } = this.$props.node
      if (theme)
        return {
          class_id: theme.study_year_id,
          subject_id: theme.subject_id,
          theme_id: theme.id,
        }
      return null
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
    toggle(evt: any) {
      if (evt.target.closest('.action') || this.node.element_type === 'label') return
      if (!this.node.leaves.length && this.node.element_type === 'study_year') {
        const { subject_id, id } = this.node[this.node.element_type]!
        this.$emit('loadTree', { subject: subject_id, study_year: id })
      }
      this.opened = !this.opened
    },
    handleRightClick(event: any) {
      event.preventDefault()
      const type = this.$props.node.element_type
      const obj = {}
      this.setDataForTree()
      if (this.node.theme)
        Object.assign(obj, {
          class_id: this.node[this.node.element_type].study_year_id,
          subject_id: this.node[this.node.element_type].subject_id,
        })
      this.$emit('onRightClick', {
        data: {
          id: this.$props.nodeId,
          ...obj,
        },
        event,
        type,
      })
    },
    handleOnRemove(val: number[]) {
      this.$emit('onRemove', val)
      this.setDataForTree()
    },
    setDataForTree() {
      if (this.node.label) {
        setDataToUpdateTree({
          subject: this.node.label.subject_id,
          study_year: this.node.label.study_year_id,
        })
      }
    },
  },
  mounted() {
    if (['theme', 'label'].includes(this.node.element_type)) {
      const nodeElement = document.querySelector(`#node-${this.$props.nodeId}`)
      nodeElement && nodeElement.addEventListener('contextmenu', this.handleRightClick)
    }
  },
  beforeDestroy() {
    if (['theme', 'label'].includes(this.node.element_type)) {
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
  .circle {
    width: 10px;
    height: 10px;
    background: #fff;
    border: 3px solid var(--c-yellow-1);
    box-sizing: border-box;
    border-radius: 40px;
  }
}
.action {
  margin-left: 10px;
}
</style>
