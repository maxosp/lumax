<template>
  <MenuWrap
    v-model="isOpen"
    menu-width="100%"
    position-offset="-10px"
  >
    <template #activator>
      <div
        @click="onActivatorClick"
      >
        123
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

export default Vue.extend({
  name: 'Actions',
  components: {
    MenuWrap,
    SelectMenu,
    SelectItem,
  },
  props: {
    rowData: { type: Object, required: true },
    rowIndex: { type: Object, required: true },
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
  mounted() {
    console.log(this.$props.rowData)
    console.log(this.$props.rowIndex)
    console.log(this.$props.rowField)
  },
})
</script>

<style scoped></style>
