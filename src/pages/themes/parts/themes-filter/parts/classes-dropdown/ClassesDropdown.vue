<template>
  <FilterDropdown
    v-if="$classes.length"
    label="Класс"
    placeholder="Выберите класс"
    :data="$classes"
    :methods="filterModuleMethods"
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
  data() {
    return {
      filterModuleMethods: classesDropdownModule.methods,
    }
  },
  methods: {
    loadClasses,
    onSelectItem(item: DropdownItem | null) {
      console.log(item)
    },
  },
  mounted() {
    loadClasses()
  },
})
</script>
