<template>
  <div class="tree-node">
    <div
      :id="`node-${$props.nodeId}-${$props.node.element_type}`"
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
        v-else-if="!opened && node.element_type !== 'study_resource'"
        :type="prerequisiteFolder ? 'folder-prerequisite' : 'tree-folder'"
        :class="{ 'folder-icon': true, transapent: node.is_prerequisite }"
        size="35"
      />
      <div
        v-else
        class="fake-icon"
      >
        <Icon
          :type="`resource-${node.study_resource.resource_type}`"
          size="20"
          class="icon"
          :class="node.study_resource.resource_type"
        />
      </div>
      <span>{{ title }}</span>
      <Chip :item="resources.videos" icon="play" />
      <Chip :item="resources.texts" icon="text" />
      <Chip :item="resources.links" icon="link" />
      <Chip :item="resources.files" icon="file" />
      <Actions
        v-if="showActions"
        :id="node.study_resource && node.study_resource.id || node.theme.id"
        :is-theme="node.element_type === 'theme'"
        :selected="[]"
        :theme-id="node.element_type === 'theme' ? node.theme.id : null"
        class="action"
        @onRemove="(val) => loadModalToDelete(val)"
        @onEdit="(val) => handleEdit(val)"
        @create="(val) => handleCreate(val)"
      />
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
import Chip from '@/pages/dictionary/resources/list/parts/tree/parts/Chip.vue'
import Actions from '@/pages/dictionary/resources/list/parts/Actions.vue'
import { TreeData } from '@/features/api/types'
import { removeHtmlTags } from '@/pages/dictionary/themes/list/utils'
import { loadModalToDelete } from '@/pages/dictionary/resources/list/parts/modals/resource-deletion/resource-deletion.model'
import { navigatePush } from '@/features/navigation'

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
      // @ts-ignore
      const entity = this.node[this.node.element_type]
      let fullName = ''
      // @ts-ignore
      if (this.node.element_type !== 'study_resource') {
        fullName = entity ? entity.name : ''
        if (fullName.length > 100) {
          fullName = `${fullName.slice(0, 100)}...`
        }
      } else {
        if (!entity) fullName = ''
        else if (entity.text && entity.text.length) fullName = removeHtmlTags(entity.text)
        else if (entity.file_name && entity.file_name.length)
          fullName = entity.file_name.slice(entity.file_name.lastIndexOf('/') + 1)
        else if (entity.link && entity.link.length) fullName = entity.link
        fullName = fullName.length > 30 ? `${fullName.slice(0, 30)}...` : fullName
      }
      return fullName
    },
    resources() {
      return {
        videos: {
          // @ts-ignore
          count: this.calculateLeavesOfType('video'),
          description: 'Количество ресурсов типа "Видео"',
        },
        texts: {
          // @ts-ignore
          count: this.calculateLeavesOfType('text'),
          description: 'Количество ресурсов типа "Текст"',
        },
        links: {
          // @ts-ignore
          count: this.calculateLeavesOfType('link'),
          description: 'Количество ресурсов типа "Ссылка"',
        },
        files: {
          // @ts-ignore
          count: this.calculateLeavesOfType('file'),
          description: 'Количество ресурсов типа "Файл"',
        },
      }
    },
    showActions() {
      // @ts-ignore
      const { element_type } = this.$props.node
      return element_type === 'study_resource' || element_type === 'theme'
    },
  },
  methods: {
    loadModalToDelete,
    calculateLeavesOfType(type: string): number {
      // @ts-ignore
      return this.node.leaves.filter(
        // @ts-ignore
        (el) => el.element_type === 'study_resource' && el.study_resource.resource_type === type
      ).length
    },
    toggle(evt: any) {
      if (evt.target.closest('.action')) return
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
          theme: this.$props.node.theme ? this.$props.node.theme.id : undefined,
        },
        event,
        type,
      })
    },
    handleEdit(id: number) {
      navigatePush({ name: 'resources-edit', params: { id: `${id}` } })
    },
    handleCreate(id: number) {
      navigatePush({
        name: 'resources-create',
        params: { id: `${id}` },
      })
    },
  },
  mounted() {
    // @ts-ignore
    const { element_type } = this.$props.node
    if (element_type === 'theme' || element_type === 'study_resource') {
      const nodeElement = document.querySelector(
        // @ts-ignore
        `#node-${this.$props.nodeId}-${element_type}`
      )
      // @ts-ignore
      nodeElement && nodeElement.addEventListener('contextmenu', this.handleRightClick)
    }
  },
  beforeDestroy() {
    // @ts-ignore
    const { element_type } = this.$props.node
    if (element_type === 'theme' || element_type === 'study_resource') {
      const nodeElement = document.querySelector(
        // @ts-ignore
        `#node-${this.$props.nodeId}-${element_type}`
      )
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
  fill: transparent;
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
.chip:first-child {
  margin-left: 15px;
}

.chip-icon {
  fill: #fff;
}
.fake-icon {
  @mixin flex-center;
  width: 30px;
  height: 30px;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  margin-right: 15px;
  .icon.text {
    fill: var(--base-text-secondary);
  }
  .icon.file {
    fill: transparent;
    stroke: var(--c-dark-0);
  }
  .icon.link {
    fill: transparent;
    stroke: var(--c-yellow-1);
  }
}
.action {
  margin-left: 10px;
}
</style>
