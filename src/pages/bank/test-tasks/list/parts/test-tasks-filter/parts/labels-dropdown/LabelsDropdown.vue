<template>
  <FilterDropdown
    label="Метки заданий"
    placeholder="Выберите метку"
    :data="$items"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    :disabled="!$canSetLabels"
    :loading="$loading"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  labelsDropdownModule,
  loadLabels,
} from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/parts/labels-dropdown/labels-dropdown.model'
import { $canSetLabels } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/test-tasks-filter.model'
import { DropdownItem } from '@/pages/common/types'
import { $selectedTheme } from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $canSetLabels,
    ...labelsDropdownModule.store,
    $selectedTheme,
  },
  methods: {
    ...labelsDropdownModule.methods,
    loadLabels,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  beforeDestroy() {
    this.dropdownDestroy()
  },
  mounted() {
    if (this.$selectedTheme) loadLabels()
  },
})
</script>
