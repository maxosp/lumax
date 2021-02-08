<template>
  <FilterDropdown
    v-if="$authors.length"
    label="Автор"
    placeholder="Выберите автора"
    :data="$authors"
    :methods="$props.moduleMethods"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  authorsDropdownModule,
  loadAuthors,
  $authors,
} from '@/pages/themes/parts/themes-filter/parts/authors-dropdown/authors-dropdown.model'
import { FilterDropdownMethods } from '@/pages/common/filter-dropdown/types'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $authors,
    ...authorsDropdownModule.store,
  },

  props: {
    moduleMethods: { type: Object as PropType<FilterDropdownMethods>, required: true },
  },
  methods: {
    loadAuthors,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadAuthors()
  },
})
</script>
