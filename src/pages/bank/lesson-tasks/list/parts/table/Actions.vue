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
import { SelectItemI } from '@/ui/select/BaseSelect.vue'
import { DropdownItem } from '@/pages/common/types'
import {
  contextMethodsOneLesson,
  contextMethodsManyLessons,
} from '@/pages/bank/lesson-tasks/list/constants'
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
    isFolder: { type: Boolean, default: false },
  },
  data: () => ({
    isOpen: false,
    popoverPlacement: 'left-start',
    popoverClass: 'actions__popover_start',
  }),
  computed: {
    items(): DropdownItem[] {
      if (this.isFolder) {
        return [
          { name: 'create_folder', title: 'Создать папку' },
          { name: 'create_task', title: 'Создать задание' },
          { name: 'edit_folder', title: 'Редактировать' },
          { name: 'delete_folder', title: 'Удалить' },
        ]
      }
      return this.$props.selected.length > 1 ? contextMethodsManyLessons : contextMethodsOneLesson
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
        delete: () => this.$emit('onRemove', ids),
        delete_all: () => this.$emit('onRemove', ids),
        duplicate: () => this.$emit('onDuplicate', ids),
        duplicate_n_times: () => this.$emit('onDuplicateNTimes', ids),
        preview: () => this.$emit('onPreview', ids),
        create_folder: () => this.$emit('onCreateFolder'),
        create_task: () => this.$emit('onCreateTask'),
        edit_folder: () => this.$emit('onEditFolder'),
        delete_folder: () => this.$emit('onDeleteFolder'),
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
