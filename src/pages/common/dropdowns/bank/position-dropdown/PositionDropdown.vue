<template>
  <FilterDropdown
    v-if="$folders.length"
    label="Расположение"
    placeholder="Выберите папку"
    :data="$folders"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    is-recursive
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  $folders,
  foldersDropdownModule,
  loadFolders,
  setSelectedFolder,
} from '@/pages/common/dropdowns/bank/position-dropdown/position-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $folders,
    ...foldersDropdownModule.store,
  },
  methods: {
    loadFolders,
    ...foldersDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      setSelectedFolder(item)
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadFolders()
  },
})
</script>
