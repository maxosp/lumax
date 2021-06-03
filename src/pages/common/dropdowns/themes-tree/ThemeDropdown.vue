<template>
  <FilterDropdown
    label="Тема"
    placeholder="Выберите тему"
    :methods="themesDropdownMethods"
    :data="$themes"
    :store="{ $item, $itemsDropdown, $searchString }"
    :disabled="isDisabled ? !$canSetThemePosition : false"
    is-recursive
    @item-changed="onSelectItem"
  />
</template>


<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  $themes,
  themesDropdownModule,
  setSelectedTheme,
  loadThemes,
  $canSetThemePosition,
} from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  props: {
    isDisabled: { type: Boolean, default: false },
    isPreload: { type: Boolean, default: false },
  },
  effector: {
    $themes,
    $canSetThemePosition,
    ...themesDropdownModule.store,
  },
  data() {
    return {
      themesDropdownMethods: themesDropdownModule.methods,
    }
  },
  methods: {
    ...themesDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      setSelectedTheme(item)
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    if (this.isPreload) loadThemes()
  },
})
</script>

