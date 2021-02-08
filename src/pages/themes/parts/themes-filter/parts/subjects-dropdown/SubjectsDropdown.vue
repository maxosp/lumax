<template>
  <FilterDropdown
    v-if="$subjects.length"
    label="Предмет"
    placeholder="Выберите предмет"
    :data="$subjects"
    :methods="filterModuleMethods"
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
} from '@/pages/themes/parts/themes-filter/parts/subjects-dropdown/subjects-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $subjects,
    ...subjectsDropdownModule.store,
  },
  data() {
    return {
      filterModuleMethods: subjectsDropdownModule.methods,
    }
  },
  methods: {
    loadSubjects,
    onSelectItem(item: DropdownItem | null) {
      console.log(item)
    },
  },
  mounted() {
    loadSubjects()
  },
})
</script>
