<template>
  <FilterDropdown
    v-if="$classes.length"
    label="Класс"
    placeholder="Выберите класс"
    :items="$classes"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  loadClasses,
  $classes,
} from '@/pages/themes/parts/themes-filter/parts/classes-dropdown/classes-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $classes,
  },
  methods: {
    loadClasses,
    onSelectItem(item: DropdownItem) {
      console.log(item)
    },
  },
  mounted() {
    loadClasses()
  },
})
</script>
