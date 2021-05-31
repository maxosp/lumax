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
  setSelectedClass,
  $selectedClass,
} from '@/pages/common/dropdowns/class/classes-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $classes,
    ...classesDropdownModule.store,
    $selectedClass,
  },
  methods: {
    ...classesDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      setSelectedClass(item)
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadClasses()
  },
})
</script>
