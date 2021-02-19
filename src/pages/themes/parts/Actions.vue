<template>
  <MenuWrap
    v-model="isOpen"
    class="actions"
    menu-width="100%"
  >
    <template #activator>
      <Icon
        class="actions-activator"
        type="kebab-menu"
        size="24"
        @click="onActivatorClick"
      />
    </template>

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
import Icon from '@/ui/icon/Icon.vue'
import MenuWrap from '@/ui/menu/MenuWrap.vue'
import SelectMenu from '@/ui/select/parts/SelectMenu.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import { navigatePush } from '@/features/navigation'
import { SelectItemI } from '@/ui/select/BaseSelect.vue'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  name: 'Actions',
  components: {
    Icon,
    MenuWrap,
    SelectMenu,
    SelectItem,
  },
  props: {
    id: { type: Number, required: true },
    selected: { type: Array as PropType<number[]>, required: true },
  },
  data: () => ({
    isOpen: false,
  }),
  computed: {
    items(): DropdownItem[] {
      if (this.$props.selected.length) {
        return [{ name: 'delete-all', title: 'Удалить выделенные темы' }]
      }
      return [
        { name: 'edit', title: 'Редактировать' },
        { name: 'delete', title: 'Удалить' },
      ]
    },
  },
  methods: {
    onActivatorClick() {
      this.isOpen = !this.isOpen
    },
    handleAction(item: SelectItemI) {
      if (item.name === 'edit') {
        navigatePush({ name: 'theme-creation', params: { id: this.$props.id } })
      } else if (item.name === 'delete') {
        this.$emit('onRemove', this.$props.id)
      } else if (item.name === 'delete-all') {
        this.$emit('onRemove', this.$props.selected)
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
