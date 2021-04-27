<template>
  <FilterDropdown
    v-if="$courses.length"
    label="Курс"
    placeholder="Выберите курс"
    :data="$courses"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  courseDropdownModule,
  loadCourses,
  $courses,
} from '@/pages/common/dropdowns/bank/lesson-tasks/course-dropdown/course-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $courses,
    ...courseDropdownModule.store,
  },
  methods: {
    ...courseDropdownModule.methods,
    loadCourses,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadCourses()
  },
})
</script>
