<template>
  <FilterDropdown
    v-if="$languages.length"
    label="Язык"
    placeholder="Выберите язык"
    :data="$languages"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  languagesDropdownModule,
  $languages,
  loadLanguages,
} from '@/pages/common/dropdowns/olympiad-tasks/language-dropdown/language-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $languages,
    ...languagesDropdownModule.store,
  },
  methods: {
    loadLanguages,
    ...languagesDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadLanguages()
  },
})
</script>
