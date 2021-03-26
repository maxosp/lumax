<template>
  <FilterDropdown
    v-if="$scores.length"
    label="Баллы"
    placeholder="Выберите количество баллов"
    :data="$scores"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  $scores,
  scoreDropdownModule,
  loadScores,
  setSelectedScore,
} from '@/pages/common/dropdowns/bank/lesson-tasks/score-dropdown/score-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $scores,
    ...scoreDropdownModule.store,
  },
  methods: {
    ...scoreDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
      setSelectedScore(item)
    },
  },
  mounted() {
    loadScores()
  },
})
</script>
