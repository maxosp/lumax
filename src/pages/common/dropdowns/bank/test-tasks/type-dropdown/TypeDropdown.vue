<template>
  <FilterDropdown
    v-if="$types.length"
    label="Тип задания"
    placeholder="Выберите тип"
    :data="$types"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  typeDropdownModule,
  loadTypes,
  $types,
} from '@/pages/common/dropdowns/bank/test-tasks/type-dropdown/type-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $types,
    ...typeDropdownModule.store,
  },
  methods: {
    ...typeDropdownModule.methods,
    loadTypes,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadTypes()
  },
})
</script>
