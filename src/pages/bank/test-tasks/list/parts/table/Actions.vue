<template>
  <v-popover
    :open="isOpen"
    :placement="popoverPlacement"
    :popover-class="popoverClass"
    popover-inner-class=""
    @apply-hide="closeMenu"
  >
    <Icon
      class="actions-activator"
      type="kebab-menu"
      size="24"
      @click="onActivatorClick"
    />
    <template v-slot:popover>
      <SelectMenu v-if="isOpen">
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
  </v-popover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import SelectMenu from '@/ui/select/parts/SelectMenu.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import { navigatePush } from '@/features/navigation'
import { SelectItemI } from '@/ui/select/BaseSelect.vue'
import { DropdownItem } from '@/pages/common/types'
import {
  contextMethodsOneTask,
  contextMethodsManyTasks,
} from '@/pages/bank/test-tasks/list/constants'
import { actionsSelectMenuMaxHeight, selectItemHeight } from '@/pages/common/constants'

export default Vue.extend({
  name: 'Actions',
  components: {
    Icon,
    SelectMenu,
    SelectItem,
  },
  props: {
    id: { type: Number, required: true },
    selected: { type: Array as PropType<number[]>, required: true },
    light: { type: Boolean as PropType<boolean>, default: false },
    isTheme: { type: Boolean as PropType<boolean> },
    isPrerequisite: { type: Boolean as PropType<boolean>, default: false },
    isTableHeader: { type: Boolean as PropType<boolean> },
    subject: { type: [Number, null] as PropType<number | null> },
    studyYear: { type: [Number, null] as PropType<number | null> },
  },
  data: () => ({
    isOpen: false,
    popoverPlacement: 'left-start',
    popoverClass: 'actions__popover_start',
  }),
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
      if (this.isTableHeader)
        return [
          { name: 'duplicate', title: 'Дублировать' },
          { name: 'duplicate_n_times', title: 'Дублировать n раз' },
        ]
      return this.$props.selected.length ? contextMethodsManyTasks : contextMethodsOneTask
    },
  },
  methods: {
    onActivatorClick() {
      this.setPopoverPlacement()
      this.isOpen = !this.isOpen
    },
    setPopoverPlacement() {
      const vuetableBottomPosition = this.$parent.$el.getBoundingClientRect().bottom
      const actionsBottomPosition = this.$el.getBoundingClientRect().bottom
      const selectItemsSumHeight = this.items.length * selectItemHeight
      const selectMenuHeight =
        selectItemsSumHeight > actionsSelectMenuMaxHeight
          ? actionsSelectMenuMaxHeight
          : selectItemsSumHeight

      if (vuetableBottomPosition - actionsBottomPosition < selectMenuHeight) {
        this.popoverPlacement = 'left-end'
        this.popoverClass = 'actions__popover_end'
      }
    },
    handleAction(item: SelectItemI) {
      const ids = this.selected.length ? this.selected : [this.id]
      const map = {
        edit: () => this.$emit('onEdit', this.$props.id),
        duplicate: () => this.$emit('onDuplicate', ids),
        duplicate_n_times: () => this.$emit('onDuplicateNTimes', ids),
        delete_theme: () => this.$emit('onRemoveTheme', ids),
        delete_task: () => this.$emit('onRemoveTask', ids),
        delete: () => this.$emit('onRemove', ids),
        delete_all: () => this.$emit('onRemove', ids),
        send_to_check: () => this.$emit('onSendToReview', ids[0]),
        send_to_check_all: () => this.$emit('onSendToReview', ids),
        public: () => this.$emit('onPublish', ids),
        public_all: () => this.$emit('onPublish', ids),
        preview: () => this.$emit('onPreview', ids),
        edit_theme: () =>
          navigatePush({ name: 'themes-edit', params: { id: `${this.$props.id}` } }),
        create_theme: () =>
          navigatePush({
            name: 'themes-create',
            params: {
              subject: `${this.$props.subject}`,
              studyYear: `${this.$props.studyYear}`,
              theme: `${this.$props.id}`,
            },
          }),
        create_task: () =>
          navigatePush({
            name: 'test-tasks-create',
            params: {
              subject: `${this.$props.subject}`,
              studyYear: `${this.$props.studyYear}`,
              theme: `${this.$props.id}`,
            },
          }),
        edit_task: () => this.$emit('onEdit', this.$props.id),
      }
      map[item.name] ? map[item.name]() : undefined
    },
    closeMenu() {
      this.isOpen = false
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

<style>
.actions__popover {
  @mixin actions-popover;
}
</style>
