<template>
  <FilterDropdown
    label="Положение темы в таксономии"
    placeholder="Тема привязана к классу"
    :methods="positionModuleMethods"
    :data="$positions"
    :store="{ $item, $itemsDropdown, $searchString }"
    :disabled="!$canSetThemePosition"
    is-recursive
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import { $canSetThemePosition } from '@/pages/dictionary/themes/create/theme-creation-page.model'
import {
  $positions,
  positionDropdownModule,
} from '@/pages/dictionary/themes/create/parts/position/position.model'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $positions,
    $canSetThemePosition,
    ...positionDropdownModule.store,
  },
  data() {
    return {
      positionModuleMethods: positionDropdownModule.methods,
    }
  },
})
</script>
