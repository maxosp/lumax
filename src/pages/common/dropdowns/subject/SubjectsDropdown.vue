<template>
  <FilterDropdown
    v-if="$items.length"
    label="Предмет"
    placeholder="Выберите предмет"
    :data="$items"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    :loading="$loading"
    @infiniteHandler="nextPageTrigger"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  subjectsDropdownModel,
  loadSubjects,
  setSelectedSubject,
} from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    ...subjectsDropdownModel.store,
  },
  methods: {
    ...subjectsDropdownModel.methods,
    onSelectItem(item: DropdownItem | null) {
      setSelectedSubject(item || null)
      this.$emit('setItem', item ? item.name : null)
    },
  },
  beforeDestroy() {
    this.dropdownDestroy()
  },
  mounted() {
    loadSubjects()
  },
})
</script>
