<template>
  <FilterDropdown
    label="Тема"
    placeholder="Выберите тему"
    :methods="themeModuleMethods"
    :data="$themes"
    :store="{ $item, $itemsDropdown, $searchString }"
    :disabled="!$canSetTheme"
    is-recursive
    @item-changed="setSelectedTheme"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import { $canSetTheme } from '@/pages/dictionary/resources/edit/resource-edition-page.model'
import {
  $themes,
  themeDropdownModule,
  setSelectedTheme,
} from '@/pages/dictionary/resources/edit/parts/theme/theme.model'

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
  methods: { setSelectedTheme },
})
</script>
