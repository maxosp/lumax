<template>
  <FilterDropdown
    v-if="$difficulties.length"
    label="Сложность"
    placeholder="Выберите сложность"
    :data="$difficulties"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  $difficulties,
  difficultyDropdownModule,
  loadDifficulties,
  setSelectedDifficulty,
} from '@/pages/common/dropdowns/testing/difficulty-dropdown/difficulty-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $difficulties,
    ...difficultyDropdownModule.store,
  },
  methods: {
    ...difficultyDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
      setSelectedDifficulty(item)
    },
  },
  mounted() {
    loadDifficulties()
  },
})
</script>
