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
  subjectDropdownModule,
  loadSubjects,
  $subjects,
  setSelectedSubject,
} from '@/pages/dictionary/resources/list/parts/resources-filter/parts/subject/subject-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $subjects,
    ...subjectDropdownModule.store,
  },
  methods: {
    ...subjectDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
      setSelectedSubject(item)
    },
  },
  mounted() {
    loadSubjects()
  },
})
</script>
