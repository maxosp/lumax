<template>
  <FilterDropdown
    v-if="$difficulty.length"
    label="Слолжность"
    placeholder="Выберите сложность"
    :data="$difficulty"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  loadDifficulty,
  $difficulty,
  difficultyDropdownModule,
} from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/difficulty-dropdown/difficulty-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $difficulty,
    ...difficultyDropdownModule.store,
  },
  methods: {
    ...difficultyDropdownModule.methods,
    loadDifficulty,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadDifficulty()
  },
})
</script>
