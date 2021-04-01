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
    light: { type: Boolean, default: false },
    isTheme: { type: Boolean },
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
      if (this.light && this.isTheme)
        return [
          { name: 'create-theme', title: 'Создать тему' },
          { name: 'create-task', title: 'Создать задание' },
          { name: 'edit-theme', title: 'Редактировать' },
          { name: 'delete-theme', title: 'Удалить' },
        ]
      if (this.light && !this.isTheme)
        return [
          { name: 'edit-task', title: 'Редактировать' },
          { name: 'preview', title: 'Предпросмотр' },
          { name: 'delete-task', title: 'Удалить' },
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
      switch (item.name) {
        case 'edit':
          navigatePush({ name: 'test-tasks-edit', params: { id: this.$props.id } })
          break
        case 'delete-theme':
          this.$emit('onRemoveTheme', [this.$props.id])
          break
        case 'delete-task':
          this.$emit('onRemoveTask', [this.$props.id])
          break
        case 'delete':
          this.$emit('onRemove', this.$props.id)
          break
        case 'delete_all':
          this.$emit('onRemove', this.$props.selected)
          break
        case 'send_to_check':
          this.$emit('onCheck', this.$props.id)
          break
        case 'send_to_check_all':
          this.$emit('onCheck', this.$props.selected)
          break
        case 'public':
          this.$emit('onPublish', this.$props.id)
          break
        case 'public_all':
          this.$emit('onPublish', this.$props.selected)
          break
        case 'preview':
        case 'preview_all':
          this.$emit('onPreview', this.$props.selected)
          break
        case 'edit-theme':
          navigatePush({ name: 'themes-edit', params: { id: `${this.$props.id}` } })
          break
        case 'edit-task':
          navigatePush({ name: 'test-tasks-edit', params: { id: `${this.$props.id}` } })
          break
        case 'create-theme':
          navigatePush({
            name: 'themes-create',
            params: {
              subject: `${this.$props.subject}`,
              studyYear: `${this.$props.studyYear}`,
              theme: `${this.$props.id}`,
            },
          })
          break
        default:
          break
      }
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
