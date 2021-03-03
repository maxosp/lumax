<template>
  <FilterDropdown
    label="Тема"
    placeholder="Выберите тему"
    :methods="themeModuleMethods"
    :data="$themes"
    :store="{ $item, $itemsDropdown, $searchString }"
    :disabled="!$canSetTheme"
    is-recursive
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import { $canSetTheme } from '@/pages/dictionary/resources/create/resource-creation-page.model'
import {
  $themes,
  themeDropdownModule,
} from '@/pages/dictionary/resources/create/parts/theme/theme.model'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $themes,
    $canSetTheme,
    ...themeDropdownModule.store,
  },
  data() {
    return {
      themeModuleMethods: themeDropdownModule.methods,
    }
  },
})
</script>
