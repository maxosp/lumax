<template>
  <FilterDropdown
    label="Тема"
    placeholder="Выберите тему"
    :methods="themesDropdownMethods"
    :data="$themes"
    :store="{ $item, $itemsDropdown, $searchString }"
    is-recursive
    :disabled="!$canSetThemePosition"
    @item-changed="setSelectedTheme"
  />
</template>


<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  $themes,
  themesDropdownModule,
  setSelectedTheme,
} from '@/pages/labels/parts/modals/label-edition/parts/theme/theme-dropdown.model'
import { $canSetThemePosition } from '@/pages/labels/parts/modals/label-edition/label-edition.modal'

export default Vue.extend({
  components: {
    FilterDropdown,
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
  methods: { setSelectedTheme },
})
</script>

