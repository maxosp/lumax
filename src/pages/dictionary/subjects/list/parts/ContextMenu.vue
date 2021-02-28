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
import { DropdownItem } from '@/pages/common/types'
import { ContextMenuType } from '@/pages/dictionary/themes/list/types'
import { navigatePush } from '@/features/navigation'

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
      if (this.$props.type === 'table_subjects') {
        if (this.$props.selected.length) {
          return [{ name: 'delete-all', title: 'Удалить выделенные предметы' }]
        }
      }
      if (this.$props.type === 'subject') {
        return [
          { name: 'create', title: 'Создать предмет' },
          { name: 'edit', title: 'Редактировать' },
          { name: 'delete', title: 'Удалить' },
        ]
      }
      return [
        { name: 'edit', title: 'Редактировать' },
        { name: 'do_mandatory', title: 'Сделать обязательным' },
        { name: 'do_optional', title: 'Сделать необязательным' },
        { name: 'delete', title: 'Удалить' },
      ]
    },
  },
  methods: {
    handleAction(item: SelectItemI) {
      switch (item.name) {
        case 'create':
          navigatePush({ name: 'subjects-create' })
          break
        case 'edit':
          navigatePush({ name: 'subjects-edit', params: { id: this.$props.id } })
          break
        case 'delete':
          this.$emit('onRemove', this.$props.id)
          break
        case 'delete-all':
          this.$emit('onRemove', this.$props.selected)
          break
        case 'do_mandatory':
          this.$emit('doMondatory', this.$props.id)
          break
        case 'do_optional':
          this.$emit('doOptional', this.$props.id)
          break
        default:
          break
      }
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
