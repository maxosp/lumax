<template>
  <FilterDropdown
    label="Метки заданий"
    placeholder="Выберите метку"
    :data="$labels"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    :disabled="!$canSetLabels"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  labelsDropdownModule,
  loadLabels,
  $labels,
} from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/parts/labels-dropdown/labels-dropdown.model'
import { $canSetLabels } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/test-tasks-filter.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $labels,
    $canSetLabels,
    ...labelsDropdownModule.store,
  },
  methods: {
    ...labelsDropdownModule.methods,
    loadLabels,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadLabels()
  },
})
</script>
