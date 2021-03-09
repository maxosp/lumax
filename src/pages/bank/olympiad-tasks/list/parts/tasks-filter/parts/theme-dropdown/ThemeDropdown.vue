<template>
  <FilterDropdown
    label="Тема"
    placeholder="Выберите тему"
    :data="$themes"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    :disabled="!$canSetThemePosition"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  themesDropdownModule,
  $themes,
  setSelectedTheme,
} from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/parts/theme-dropdown/theme-dropdown.model'
import { $canSetThemePosition } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/test-tasks-filter.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $themes,
    $canSetThemePosition,
    ...themesDropdownModule.store,
  },
  data() {
    return {
      themeMethods: themesDropdownModule.methods,
    }
  },
  methods: {
    ...themesDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      setSelectedTheme(item)
      this.$emit('setItem', item ? item.name : null)
    },
  },
})
</script>
