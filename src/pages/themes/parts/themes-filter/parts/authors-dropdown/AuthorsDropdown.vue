<template>
  <FilterDropdown
    v-if="$authors.length"
    label="Автор"
    placeholder="Выберите автора"
    :items="$authors"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
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
  },
  methods: {
    loadAuthors,
    onSelectItem(item: DropdownItem) {
      console.log(item)
    },
  },
  mounted() {
    loadAuthors()
  },
})
</script>
