<template>
  <FilterDropdown
    label="Тема"
    placeholder="Выберите тему"
    :methods="themesDropdownMethods"
    :data="$themes"
    :store="{ $item, $itemsDropdown, $searchString }"
    is-recursive
  />
</template>


<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  $themes,
  themesDropdownModule,
  loadThemes,
} from '@/pages/labels/parts/labels-filter/parts/theme/theme-dropdown.model'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $themes,
    ...themesDropdownModule.store,
  },
  data() {
    return {
      themesDropdownMethods: themesDropdownModule.methods,
    }
  },
  methods: { loadThemes },
  mounted() {
    loadThemes()
  },
})
</script>

