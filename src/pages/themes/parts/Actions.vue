<template>
  <MenuWrap
    v-model="isOpen"
    menu-width="100%"
  >
    <template #activator>
      <div
        class="actions-activator"
        @click="onActivatorClick"
      >
        icon...
      </div>
    </template>

    <template #menu>
      <SelectMenu>
        <slot
          v-for="item in items"
          v-bind="{item, selectItem, closeMenu}"
          name="item"
        >
          <SelectItem
            :key="item.value"
            :active="false"
            class="action-item"
            @click="() => {
              selectItem(item)
              closeMenu()
            }"
          >
            {{ item.label }}
          </SelectItem>
        </slot>
      </SelectMenu>
    </template>
  </MenuWrap>
</template>

<script lang="ts">
import Vue from 'vue'
import MenuWrap from '@/ui/menu/MenuWrap.vue'
import SelectMenu from '@/ui/select/parts/SelectMenu.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import { SelectItemI } from '@/ui/select/BaseSelect.vue'

export default Vue.extend({
  name: 'Actions',
  components: {
    MenuWrap,
    SelectMenu,
    SelectItem,
  },
  props: {
    rowData: { type: Object, required: true },
    rowIndex: { type: Number, required: true },
    rowField: { type: Object, required: true },
  },
  data: () => ({
    isOpen: false,
    items: [
      { value: 'edit', label: 'Редактировать' },
      { value: 'delete', label: 'Удалить' },
    ],
  }),
  methods: {
    onActivatorClick() {
      this.isOpen = !this.isOpen
    },
    selectItem(item: SelectItemI) {
      console.log(item)
    },
    closeMenu() {
      this.isOpen = false
    },
  },
})
</script>

<style scoped>
.actions-activator {
  cursor: pointer;
}
.action-item {
  &:hover {
    background-color: var(--c-yellow-0);
  }
}
</style>
