<template>
  <div class="tree-node">
    <div
      :id="`node-${$props.nodeId}`"
      class="label"
      @click="toggle"
    >
      <Icon
        :type="iconType"
        :class="{ 'folder-icon': true, transparent: node.is_prerequisite }"
        size="35"
      />
      <span>{{ title }}</span>
      <Chip
        v-if="node.element_type === 'theme'"
        primary
        :item="resources.tasks"
        icon="copy"
      />
      <Chip :item="resources.videos" icon="play" />
      <Chip :item="resources.texts" icon="text" />
      <Chip :item="resources.links" icon="link" />
    </div>
    <div v-if="opened" class="leaf">
      <TreeNode
        v-for="leaf in node.leaves"
        :key="leaf[leaf.element_type].id"
        :node="leaf"
        :node-id="leaf[leaf.element_type].id || leaf[leaf.element_type].name"
        :prerequisite-folder="leaf.virtual_folder && leaf.virtual_folder.code === 'prerequisite'"
        @onRightClick="$emit('onRightClick', $event)"
        @loadTree="val => $emit('loadTree', val)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import Chip from '@/pages/dictionary/themes/list/parts/themes-tree/parts/Chip.vue'
import { TreeData } from '@/features/api/types'
import { sortTreeLeaves } from '@/features/lib'
import { setDataToUpdateTree } from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'

export default Vue.extend({
  name: 'TreeNode',
  components: {
    Icon,
    Chip,
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
    iconType(): string {
      if (this.prerequisiteFolder) {
        return 'folder-prerequisite'
      }
      if (this.opened) {
        return 'tree-folder-opened'
      }
      return 'tree-folder'
    },
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
          count: this.node.theme && this.node.theme.assignments_count,
          description: 'Количество заданий',
        },
        videos: {
          count: this.node.theme && this.node.theme.media_resource_count,
          description: 'Количество ресурсов типа "Видео"',
        },
        texts: {
          count: this.node.theme && this.node.theme.text_resource_count,
          description: 'Количество ресурсов типа "Текст"',
        },
        links: {
          count: this.node.theme && this.node.theme.link_resource_count,
          description: 'Количество ресурсов типа "Ссылка"',
        },
      }
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
    toggle(evt: any) {
      if (evt.target.closest('.action') || this.node.element_type === 'label') return
      if (!this.node.leaves.length && this.node.element_type === 'study_year') {
        const { subject_id, id } = this.node[this.node.element_type]!
        this.$emit('loadTree', { subject: subject_id, study_year: id })
      } else if (!this.node.leaves.length && !this.parent && this.node.element_type === 'subject') {
        const { id } = this.node[this.node.element_type]!
        this.$emit('loadTree', { subject: id, is_prerequisite: true })
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
      setDataToUpdateTree({
        subject: this.node.subject!.id,
        study_year: this.node.study_year!.id,
        theme: this.node.theme?.parent_theme_id,
      })
      this.$emit('onRightClick', {
        data: {
          id: this.$props.nodeId,
          subject: this.$props.node.subject.id,
          studyYear: this.$props.node.study_year.id,
        },
        event,
        type,
      })
    },
  },
  mounted() {
    if (this.$props.node.element_type === 'theme') {
      const nodeElement = document.querySelector(`#node-${this.$props.nodeId}`)
      nodeElement && nodeElement.addEventListener('contextmenu', this.handleRightClick)
    }
  },
  beforeDestroy() {
    if (this.$props.node.element_type === 'theme') {
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
</style>
