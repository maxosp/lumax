<template>
  <BaseDropdown
    class="input dropdown"
    :value="correctValue"
    :label="$props.label"
    :placeholder="$props.placeholder"
    @input="$emit('search-string-changed', $event)"
    @clear="clear"
  >
    <template #default="{closeMenu}">
      <div v-if="$props.items.length">
        <SelectItem
          v-for="item in $props.items"
          :key="item.name"
          :placeholder="item.title"
          @click="onSelectItem(item, closeMenu)"
        >
          {{ item.title }}
        </SelectItem>
      </div>
      <div v-else>
        <SelectItem @click="closeMenu">
          Не найдено совпадений
        </SelectItem>
      </div>
    </template>
  </BaseDropdown>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import { DropdownItem } from '@/pages/common/types'
import {
  setItems,
  $item,
  $itemsDropdown,
  $searchString,
  itemChanged,
  resetSearchString,
  resetItem,
} from '@/pages/common/filter-dropdown/filter-dropdown.model'

export default Vue.extend({
  components: {
    BaseDropdown,
    SelectItem,
  },
  effector: {
    $item,
    $itemsDropdown,
    $searchString,
  },
  props: {
    label: { type: String, required: false, default: '' },
    placeholder: { type: String, required: false, default: '' },
    items: { type: [Array, null] as PropType<DropdownItem[] | null>, default: null },
  },
  computed: {
    correctValue() {
      // @ts-ignore
      const currentItem = this.$itemsDropdown.find((el: DropdownItem) => el.name === this.$item)
      // @ts-ignore
      return currentItem ? currentItem.title : this.$searchString
    },
  },
  methods: {
    onSelectItem(item: DropdownItem, cb: any) {
      this.$emit('item-changed', item)
      itemChanged(item.name)
      resetSearchString()
      cb()
    },
    clear() {
      resetItem()
      resetSearchString()
    },
  },
  mounted() {
    setItems(this.$props.items)
  },
})
</script>
