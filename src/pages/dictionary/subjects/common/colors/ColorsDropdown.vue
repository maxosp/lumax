<template>
  <FilterDropdown
    v-if="$colors.length"
    label="Цвет"
    placeholder="Выберите цвет предмета"
    :methods="subjectModuleMethods"
    :data="$colors"
    :store="{ $item, $itemsDropdown, $searchString }"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  $colors,
  loadColors,
  colorDropdownModule,
} from '@/pages/dictionary/subjects/common/colors/colors-dropdown.model'

export default Vue.extend({
  components: { FilterDropdown },
  effector: {
    $colors,
    ...colorDropdownModule.store,
  },
  data() {
    return {
      subjectModuleMethods: colorDropdownModule.methods,
    }
  },
  methods: {
    loadColors,
  },
  mounted() {
    loadColors()
  },
})
</script>

<style scoped>
.dropdown /deep/ input {
  &::placeholder {
    color: var(--base-text-primary);
  }
}
</style>