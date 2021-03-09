<template>
  <FilterDropdown
    v-if="$status.length"
    label="Статус"
    placeholder="Выберите статус"
    :data="$status"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  statusDropdownModule,
  loadStatus,
  $status,
} from '@/pages/bank/olympiad-tasks/list/parts/tasks-filter/parts/status-dropdown/status-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $status,
    ...statusDropdownModule.store,
  },
  methods: {
    ...statusDropdownModule.methods,
    loadStatus,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadStatus()
  },
})
</script>
