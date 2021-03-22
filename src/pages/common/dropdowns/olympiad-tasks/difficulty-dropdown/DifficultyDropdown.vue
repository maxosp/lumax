<template>
  <FilterDropdown
    v-if="$difficultys.length"
    label="Слолжность"
    placeholder="Выберите сложность"
    :data="$difficultys"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  $difficultys,
  difficultyDropdownModule,
  loadDifficultys,
} from '@/pages/common/dropdowns/olympiad-tasks/difficulty-dropdown/difficulty-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $difficultys,
    ...difficultyDropdownModule.store,
  },
  methods: {
    loadDifficultys,
    ...difficultyDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadDifficultys()
  },
})
</script>
