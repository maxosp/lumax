<template>
  <FilterDropdown
    v-if="$authors.length"
    label="Автор"
    placeholder="Выберите автора"
    :data="$authors"
    :methods="filterModuleMethods"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  authorsDropdownModule,
  loadAuthors,
  $authors,
} from '@/pages/themes/parts/themes-filter/parts/authors-dropdown/authors-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $authors,
    ...authorsDropdownModule.store,
  },
  data() {
    return {
      filterModuleMethods: authorsDropdownModule.methods,
    }
  },
  methods: {
    loadAuthors,
    onSelectItem(item: DropdownItem | null) {
      console.log(item)
    },
  },
  mounted() {
    loadAuthors()
  },
})
</script>
