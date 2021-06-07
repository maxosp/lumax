<template>
  <FilterDropdown
    v-if="$items.length"
    label="Цвет"
    placeholder="Выберите цвет предмета"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :data="$items"
    :store="{ $item, $itemsDropdown, $searchString }"
    :loading="$loading"
    @infiniteHandler="nextPageTrigger"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  colorsDropdownModel,
  loadColors,
} from '@/pages/dictionary/subjects/common/colors/colors-dropdown.model'

export default Vue.extend({
  components: { FilterDropdown },
  effector: {
    ...colorsDropdownModel.store,
  },
  methods: {
    ...colorsDropdownModel.methods,
  },
  beforeDestroy() {
    this.dropdownDestroy()
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
