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
        v-else
        :type="node.is_prerequisite ? 'folder-prerequisite' : 'tree-folder'"
        :class="{ 'folder-icon': true, transapent: node.is_prerequisite }"
        size="35"
      />
      <span>{{ title }}</span>
      <Chip
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
        :prerequisite-folder="$props.prerequisiteFolder"
        @onRightClick="$emit('onRightClick', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import Chip from '@/pages/dictionary/themes/list/parts/themes-tree/parts/Chip.vue'
import { TreeData } from '@/features/api/types'

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
          count: '8',
          description: 'Количество заданий',
        },
        videos: {
          // @ts-ignore
          count: this.node.media_resource_count,
          description: 'Количество ресурсов типа "Видео"',
        },
        texts: {
          // @ts-ignore
          count: this.node.text_resource_count,
          description: 'Количество ресурсов типа "Текст"',
        },
        links: {
          // @ts-ignore
          count: this.node.link_resource_count,
          description: 'Количество ресурсов типа "Ссылка"',
        },
      }
    },
  },
  methods: {
    toggle() {
      // @ts-ignore
      if (this.node.leaves && this.node.leaves.length) {
        // @ts-ignore
        this.opened = !this.opened
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
      this.$emit('onRightClick', {
        data: {
          id: this.$props.nodeId,
          subject: this.$props.node.subject.id,
          studyYear: this.$props.node.study_year.id,
          theme: this.$props.node.theme.id,
        },
        event,
        type,
      })
    },
  },
  mounted() {
    // @ts-ignore
    if (this.$props.node.element_type === 'theme') {
      // @ts-ignore
      const nodeElement = document.querySelector(`#node-${this.$props.nodeId}`)
      // @ts-ignore
      nodeElement && nodeElement.addEventListener('contextmenu', this.handleRightClick)
    }
  },
  beforeDestroy() {
    // @ts-ignore
    if (this.$props.node.element_type === 'theme') {
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
  padding: 4px 8px;
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
</style>
