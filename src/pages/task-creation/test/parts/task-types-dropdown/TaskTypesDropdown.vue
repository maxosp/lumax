<template>
  <FilterDropdown
    v-if="$taskTypes.length"
    label="Тип задания"
    placeholder="Выберите тип задания"
    :data="$taskTypes"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  taskTypesDropdownModule,
  $taskTypes,
} from '@/pages/task-creation/test/parts/task-types-dropdown/task-types-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $taskTypes,
    ...taskTypesDropdownModule.store,
  },
  methods: {
    ...taskTypesDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
})
</script>
