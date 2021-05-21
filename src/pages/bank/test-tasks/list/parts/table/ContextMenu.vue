<template>
  <MenuWrap
    v-click-outside="closeMenu"
    value
    class="actions"
    menu-width="100%"
  >
    <template #menu>
      <SelectMenu>
        <slot
          v-for="item in items"
          v-bind="{item, handleAction, closeMenu}"
          name="item"
        >
          <SelectItem
            :key="item.name"
            :active="false"
            class="action-item"
            @click="() => {
              handleAction(item)
              closeMenu()
            }"
          >
            {{ item.title }}
          </SelectItem>
        </slot>
      </SelectMenu>
    </template>
  </MenuWrap>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import MenuWrap from '@/ui/menu/MenuWrap.vue'
import SelectMenu from '@/ui/select/parts/SelectMenu.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import { SelectItemI } from '@/ui/select/BaseSelect.vue'
import ClickOutside from '@/features/directives/click-outside'
import { ContextMenuType, DropdownItem } from '@/pages/common/types'
import { navigatePush } from '@/features/navigation'
import {
  contextMethodsOneTask,
  contextMethodsManyTasks,
} from '@/pages/bank/test-tasks/list/constants'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'ContextMenu',
  components: {
    MenuWrap,
    SelectMenu,
    SelectItem,
  },
  props: {
    id: { type: Number, required: true },
    selected: { type: Array as PropType<number[]>, required: true },
    type: { type: String as PropType<ContextMenuType>, required: true },
    light: { type: Boolean as PropType<boolean>, default: false },
    isTheme: { type: Boolean as PropType<boolean> },
    isPrerequisite: { type: Boolean as PropType<boolean>, default: false },
    subject: { type: [Number, null] as PropType<number | null> },
    studyYear: { type: [Number, null] as PropType<number | null> },
  },
  computed: {
    items(): DropdownItem[] {
      if (this.light && this.isTheme) {
        const items = [
          { name: 'create_task', title: 'Создать задание' },
          { name: 'edit_theme', title: 'Редактировать' },
          { name: 'delete_theme', title: 'Удалить' },
        ]
        if (!this.isPrerequisite) {
          items.unshift({ name: 'create_theme', title: 'Создать тему' })
        }
        return items
      }
      if (this.light && !this.isTheme)
        return [
          { name: 'edit_task', title: 'Редактировать' },
          { name: 'preview', title: 'Предпросмотр' },
          { name: 'delete_task', title: 'Удалить' },
        ]
      return this.$props.type === 'table_tasks' && this.$props.selected.length
        ? contextMethodsManyTasks
        : contextMethodsOneTask
    },
  },
  methods: {
    handleAction(item: SelectItemI) {
      const ids = this.selected.length ? this.selected : [this.id]
      const map = {
        create: () => navigatePush({ name: 'test-tasks-create' }),
        edit: () => this.$emit('onEdit', ids),
        delete_theme: () => this.$emit('onRemoveTheme', ids),
        delete_task: () => this.$emit('onRemoveTask', ids),
        delete: () => this.$emit('onRemove', ids),
        delete_all: () => this.$emit('onRemove', ids),
        send_to_check: () => this.$emit('onSendToReview', ids[0]),
        send_to_check_all: () => this.$emit('onSendToReview', ids),
        public: () => this.$emit('onPublish', ids[0]),
        public_all: () => this.$emit('onPublish', ids),
        preview: () => this.$emit('onPreview', ids),
        edit_theme: () =>
          navigatePush({ name: 'themes-edit', params: { id: `${this.$props.id}` } }),
        create_task: () =>
          navigatePush({
            name: 'test-tasks-create',
            params: {
              subject: `${this.$props.subject}`,
              studyYear: `${this.$props.studyYear}`,
              theme: `${this.$props.id}`,
            },
          }),
        edit_task: () =>
          navigatePush({ name: 'test-tasks-edit', params: { id: `${this.$props.id}` } }),
        create_theme: () =>
          navigatePush({
            name: 'themes-create',
            params: {
              subject: `${this.$props.subject}`,
              studyYear: `${this.$props.studyYear}`,
              theme: `${this.$props.id}`,
            },
          }),
      }
      map[item.name] ? map[item.name]() : undefined
    },
    closeMenu() {
      this.$emit('onOutsideClick')
    },
  },
})
</script>

<style scoped>
.actions /deep/ .menu-wrap {
  left: 0 !important;
  min-width: 240px;
}
.actions-activator {
  cursor: pointer;
}
.action-item {
  &:hover {
    background-color: var(--c-yellow-0);
  }
}
</style>
