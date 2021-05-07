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
    theme: { type: [Number, null] as PropType<number | null> },
  },
  computed: {
    items(): DropdownItem[] {
      if (this.$props.type === 'theme') {
        return [{ name: 'create', title: 'Создать обучающий ресурс' }]
      }
      if (this.$props.type === 'prerequisite_general') {
        return [
          { name: 'edit', title: 'Редактировать' },
          { name: 'show', title: 'Показать в папке "Пререквизиты"' },
        ]
      }
      return [
        { name: 'edit', title: 'Редактировать' },
        { name: 'delete', title: 'Удалить' },
      ]
    },
  },
  methods: {
    handleAction(item: SelectItemI) {
      switch (item.name) {
        case 'create':
          navigatePush({
            name: 'resources-create',
            params: { id: `${this.$props.theme}` },
          })
          break
        case 'edit':
          navigatePush({ name: 'resources-edit', params: { id: this.$props.id } })
          break
        case 'delete':
          this.$emit('onRemove', [this.$props.id])
          break
        case 'delete-all':
          this.$emit('onRemove', this.$props.selected)
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
