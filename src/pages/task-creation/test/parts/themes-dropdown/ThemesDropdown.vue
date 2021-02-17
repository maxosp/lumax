<template>
  <FilterDropdown
    v-if="$themes.length"
    label="Тема"
    placeholder="Выберите тему"
    :data="$themes"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  themesDropdownModule,
  loadThemes,
  $themes,
} from '@/pages/task-creation/test/parts/themes-dropdown/themes-dropdown.model.ts'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $themes,
    ...themesDropdownModule.store,
  },
  methods: {
    ...themesDropdownModule.methods,
    loadThemes,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadThemes()
  },
})
</script>
