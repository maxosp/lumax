<template>
  <FilterDropdown
    label="Тема"
    placeholder="Выберите тему"
    :methods="themesDropdownMethods"
    :data="$themes"
    :store="{ $item, $itemsDropdown, $searchString }"
    is-recursive
    @item-changed="onSelectItem"
  />
</template>


<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  $themes,
  themeDropdownModule,
  loadThemes,
} from '@/pages/dictionary/resources/list/parts/resources-filter/parts/theme/theme-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $themes,
    ...themeDropdownModule.store,
  },
  data() {
    return {
      themesDropdownMethods: themeDropdownModule.methods,
    }
  },
  methods: {
    loadThemes,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadThemes()
  },
})
</script>

