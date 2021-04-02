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
        :class="{ 'folder-icon': true, transapent: node.is_prerequisite }"
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
        <div
          class="difficulty"
          :class="taskDifficultyLevel.class"
        >
          {{ taskDifficultyLevel.title }}
        </div>
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
        v-if="showActions"
        :id="node.assignment && node.assignment.id || node.theme.id"
        light
        :is-theme="node.element_type === 'theme'"
        :selected="[]"
        :theme-id="node.element_type === 'theme' ? node.theme.id : null"
        :subject="node.theme && node.theme.subject_id"
        :study-year="node.theme && node.theme.study_year_id"
        class="action"
        @onRemoveTask="(val) => $emit('onRemoveTask', val)"
        @onRemoveTheme="(val) => $emit('onRemoveTheme', val)"
        @onPreview="(val) => $emit('onPreview', val)"
        @loadTree="val => $emit('loadTree', val)"
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
        @onRemoveTask="val => $emit('onRemoveTask', val)"
        @onRemoveTheme="val => $emit('onRemoveTheme', val)"
        @onPreview="val => $emit('onPreview', val)"
        @loadTree="val => $emit('loadTree', val)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import Chip from '@/pages/dictionary/themes/list/parts/themes-tree/parts/Chip.vue'
import Actions from '@/pages/bank/test-tasks/list/parts/table/Actions.vue'
import { TreeData } from '@/features/api/types'
import { removeHtmlTags } from '@/pages/dictionary/themes/list/utils'
import { mapTaskStatus } from '@/pages/dictionary/themes/list/constants'
import { mapTaskTypeTo } from '@/pages/common/constants'
import { sortTreeLeaves } from '@/features/lib'

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
      let fullName = ''
      if (this.node.element_type !== 'assignment') {
        // @ts-ignore
        fullName = entity ? entity.name : ''
        if (fullName.length > 100) {
          fullName = `${fullName.slice(0, 100)}...`
        }
      } else {
        // @ts-ignore
        fullName = entity ? entity.wording : ''
        // @ts-ignore
        if (!entity.wording) return ''
        fullName = removeHtmlTags(fullName)
        fullName = `${fullName.slice(0, 30)}...`
      }
      return fullName
    },
    resources() {
      return {
        tasks: {
          count: this.node.leaves.filter((el) => el.element_type === 'assignment').length,
          description: 'Количество заданий в теме',
        },
        resources: {
          count: this.node.text_resource_count,
          description: 'Количество обучающих ресурсов в теме',
        },
      }
    },
    taskIcon() {
      // @ts-ignore
      return mapTaskTypeTo[this.node.assignment!.type].icon
    },
    correctStatus() {
      // @ts-ignore
      return mapTaskStatus[this.node.assignment!.status]
    },
    taskDifficultyLevel() {
      // @ts-ignore
      switch (this.node.assignment!.difficulty) {
        case 0:
          return { title: 'Базовый уровень', class: '--green' }
        case 1:
          return { title: 'Продвинутый уровень', class: '--yellow' }
        case 2:
          return { title: 'Экзамен', class: '--red' }
        default:
          return { title: '', class: 'invisible' }
      }
    },
    showActions() {
      const { element_type } = this.$props.node
      return element_type === 'assignment' || element_type === 'theme'
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
      if (evt.target.closest('.action') || this.node.element_type === 'study_resource') return
      if (!this.node.leaves.length && this.node.element_type === 'theme') {
        const { subject_id, study_year_id, id } = this.node[this.node.element_type]!
        this.$emit('loadTree', { subject: subject_id, study_year: study_year_id, theme: id })
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
      this.$emit('onRightClick', {
        data: {
          id: this.$props.nodeId,
          isTheme: this.$props.node.element_type === 'theme',
          subject: this.$props.node.theme && this.$props.node.theme.subject_id,
          studyYear: this.$props.node.theme && this.$props.node.theme.study_year_id,
        },
        event,
        type,
      })
    },
  },
  mounted() {
    const { element_type } = this.$props.node
    if (element_type === 'theme' || element_type === 'assignment') {
      const nodeElement = document.querySelector(`#node-${this.$props.nodeId}`)
      nodeElement && nodeElement.addEventListener('contextmenu', this.handleRightClick)
    }
  },
  beforeDestroy() {
    const { element_type } = this.$props.node
    if (element_type === 'theme' || element_type === 'assignment') {
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
.difficulty,
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
</style>
