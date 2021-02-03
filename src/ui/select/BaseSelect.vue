<template>
  <MenuWrap
    v-model="isOpen"
    menu-width="100%"
    position-offset="-10px"
  >
    <template #activator>
      <SelectActivator
        :placeholder="placeholder"
        :value="selectedLabel"
        :is-open="isOpen"
        :error-message="errorMessage"
        @click="onActivatorClick"
      >
        <template #error>
          <slot name="error" />
        </template>
      </SelectActivator>
    </template>

    <template #menu>
      <SelectMenu>
        <slot
          v-for="item in items"
          v-bind="{item, selectItem, closeMenu}"
          name="item"
        >
          <SelectItem
            :key="item[itemValue]"
            :active="item[itemValue] === value"
            @click="() => {
              selectItem(item)
              closeMenu()
            }"
          >
            {{ item[itemLabel] }}
          </SelectItem>
        </slot>
      </SelectMenu>
    </template>
  </MenuWrap>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import MenuWrap from '@/ui/menu/MenuWrap.vue'
import SelectActivator from '@/ui/select/parts/SelectActivator.vue'
import SelectMenu from '@/ui/select/parts/SelectMenu.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'

export interface SelectItemI {
  [value: string]: string | number
}

export default Vue.extend({
  name: 'BaseSelect',
  components: {
    MenuWrap,
    SelectActivator,
    SelectMenu,
    SelectItem,
  },
  props: {
    value: { type: [String, Number] as PropType<string | number>, required: true },
    items: { type: Array as PropType<SelectItemI[]>, required: true },
    placeholder: { type: String as PropType<string>, required: true },
    errorMessage: { type: String as PropType<string>, default: '' },
    itemValue: { type: String as PropType<string>, default: 'value' },
    itemLabel: { type: String as PropType<string>, default: 'label' },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  data: () => ({
    isOpen: false,
  }),
  computed: {
    selectedLabel() {
      const activeItem = this.items.find((i) => i[this.itemValue] === this.value)
      if (activeItem) {
        return activeItem[this.itemLabel]
      }
      return this.value
    },
  },
  methods: {
    onActivatorClick() {
      this.isOpen = !this.isOpen
    },
    selectItem(item: SelectItemI) {
      this.$emit('change', item[this.itemValue])
    },
    closeMenu() {
      this.isOpen = false
    },
  },
})
</script>
