<template>
  <BaseDropdown
    class="input dropdown"
    :value="correctValue"
    :label="$props.label"
    :placeholder="$props.placeholder"
    :disabled="disabled"
    @input="$props.methods.searchStringChanged"
    @clear="clear"
  >
    <template #default="{closeMenu}">
      <div v-if="items.length && !isRecursive">
        <SelectItem
          v-for="item in items"
          :key="item.name"
          :with-icon="showTick(item.name)"
          :placeholder="item.title"
          @click="onSelectItem(item, closeMenu)"
        >
          {{ item.title }}
        </SelectItem>
      </div>
      <div v-if="items.length && isRecursive">
        <SelectItemRecursive
          v-for="item in items"
          :key="item.name"
          :item="item"
          :depth="0"
          :selected-item-id="+$props.store.$item"
          :selected-items-ids="selectedData"
          :placeholder="item.title"
          :handle-click="(val) => handleClick(val, closeMenu)"
        />
      </div>
      <div v-if="items.length === 0">
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
import SelectItemRecursive from '@/ui/select/parts/SelectItemRecursive.vue'
import { DropdownItem } from '@/pages/common/types'
import { FilterDropdownMethods, FilterDropdownStore } from '@/pages/common/filter-dropdown/types'
import { findItem } from '@/pages/common/filter-dropdown/lib'

export default Vue.extend({
  components: {
    BaseDropdown,
    SelectItem,
    SelectItemRecursive,
  },
  props: {
    label: { type: String, required: false, default: '' },
    placeholder: { type: String, required: false, default: '' },
    data: { type: Array as PropType<DropdownItem[]>, default: [] },
    methods: { type: Object as PropType<FilterDropdownMethods>, required: true },
    store: { type: Object as PropType<FilterDropdownStore>, required: true },
    disabled: { type: Boolean as PropType<boolean> },
    selectedData: { type: Array as PropType<DropdownItem[]> },
    isRecursive: { type: Boolean as PropType<boolean> },
  },
  computed: {
    correctValue() {
      const arr = [...this.$props.store.$itemsDropdown]
      const currentItem = this.isRecursive
        ? findItem(this.$props.store.$item, arr)
        : arr.find((el: DropdownItem) => el.name === this.$props.store.$item)

      return currentItem ? currentItem.title : this.$props.store.$searchString
    },
    items() {
      return this.$props.store.$itemsDropdown
    },
  },
  watch: {
    data: {
      handler(val, oldVal) {
        if ((!oldVal.length && !!val.length) || oldVal !== val) {
          this.$props.methods.setItems(this.$props.data)
        }
      },
    },
  },
  methods: {
    onSelectItem(item: DropdownItem, cb: any) {
      this.$emit('item-changed', item)
      this.$props.methods.itemChanged(item.name)
      this.$props.methods.resetSearchString()
      cb()
    },
    clear(event: MouseEvent) {
      event.stopPropagation()
      this.$emit('item-changed', null)
      this.$props.methods.resetItem()
      this.$props.methods.resetSearchString()
    },
    showTick(id: string) {
      return this.selectedData && !!this.selectedData.find((el: any) => +el.name === +id)
    },
    handleClick(val: DropdownItem, cb: any) {
      this.onSelectItem(val, cb)
    },
  },
  mounted() {
    this.$props.methods.setItems(this.$props.data)
  },
})
</script>
