<template>
  <FilterDropdown
    v-if="$classes.length"
    label="Класс"
    placeholder="Выберите класс"
    :methods="classModuleMethods"
    :data="$classes"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="setSelectedClass"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  $classes,
  classDropdownModule,
  loadClasses,
  setSelectedClass,
} from '@/pages/dictionary/themes/edit/parts/class/class.model'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $classes,
    ...classDropdownModule.store,
  },
  data() {
    return {
      classModuleMethods: classDropdownModule.methods,
    }
  },
  methods: { setSelectedClass },
  mounted() {
    loadClasses()
  },
})
</script>
