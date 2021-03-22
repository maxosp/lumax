<template>
  <FilterDropdown
    v-if="$subjects.length"
    label="Предмет"
    placeholder="Выберите предмет"
    :data="$subjects"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  subjectsDropdownModule,
  loadSubjects,
  $subjects,
  setSelectedSubject,
} from '@/pages/applications/incoming/parts/filter/parts/subjects-dropdown/subjects-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $subjects,
    ...subjectsDropdownModule.store,
  },
  methods: {
    ...subjectsDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      setSelectedSubject(item || null)
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadSubjects()
  },
})
</script>
