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
  contextMethodsOneLesson,
  contextMethodsManyLessons,
  contextMethodsFolder,
} from '@/pages/bank/lesson-tasks/list/constants'

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
  },
  computed: {
    items(): DropdownItem[] {
      if (this.type === 'table_lessons' || this.type === 'assignment') {
        return this.selected.length > 1 ? contextMethodsManyLessons : contextMethodsOneLesson
      }
      return contextMethodsFolder
    },
  },
  methods: {
    handleAction(item: SelectItemI) {
      const ids = this.selected.length ? this.selected : [this.id]
      const map = {
        create: () => navigatePush({ name: 'lesson-tasks-creation' }),
        edit: () => this.$emit('onEdit', this.$props.id),
        delete: () => this.$emit('onRemove', ids),
        delete_all: () => this.$emit('onRemove', ids),
        double_task: () => this.$emit('onDoubleTask', this.$props.id),
        double_n_task: () => this.$emit('onDoubleTask', ids),
        preview: () => this.$emit('onPreview', ids),
        create_folder: () => this.$emit('onCreateFolder'),
        create_task: () => this.$emit('onCreateTask'),
        edit_folder: () => this.$emit('onEditFolder'),
        delete_folder: () => this.$emit('onDeleteFolder'),
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
