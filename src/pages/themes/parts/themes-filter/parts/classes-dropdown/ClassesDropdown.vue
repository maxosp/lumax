<template>
  <FilterDropdown
    v-if="$classes.length"
    label="Класс"
    placeholder="Выберите класс"
    :data="$classes"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  loadClasses,
  $classes,
  classesDropdownModule,
} from '@/pages/themes/parts/themes-filter/parts/classes-dropdown/classes-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $classes,
    ...classesDropdownModule.store,
  },
  methods: {
    ...classesDropdownModule.methods,
    loadClasses,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadClasses()
  },
})
</script>
