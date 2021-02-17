<template>
  <FilterDropdown
    v-if="$difficulties.length"
    label="Сложность"
    placeholder="Выберите сложность"
    :data="$difficulties"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  difficultiesDropdownModule,
  $difficulties,
} from '@/pages/task-creation/test/parts/difficulties-dropdown/difficulties-dropdown.model.ts'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $difficulties,
    ...difficultiesDropdownModule.store,
  },
  methods: {
    ...difficultiesDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
})
</script>
