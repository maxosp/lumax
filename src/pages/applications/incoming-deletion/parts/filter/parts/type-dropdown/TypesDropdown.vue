<template>
  <FilterDropdown
    v-if="$types.length"
    label="По типу элемента"
    placeholder="Выберите тип элемента"
    :data="$types"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  loadTypes,
  $types,
  typesDropdownModule,
  setSelectedType,
} from '@/pages/applications/incoming-deletion/parts/filter/parts/type-dropdown/types-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $types,
    ...typesDropdownModule.store,
  },
  methods: {
    ...typesDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      setSelectedType(item)
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadTypes()
  },
})
</script>
