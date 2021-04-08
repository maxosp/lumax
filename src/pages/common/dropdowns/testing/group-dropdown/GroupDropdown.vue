<template>
  <FilterDropdown
    v-if="$groups.length"
    label="Группа"
    placeholder="Выберите группу"
    :data="$groups"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  groupDropdownModule,
  loadGroups,
  $groups,
} from '@/pages/common/dropdowns/testing/group-dropdown/group-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $groups,
    ...groupDropdownModule.store,
  },
  methods: {
    ...groupDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadGroups()
  },
})
</script>
