<template>
  <FilterDropdown
    v-if="$subjects.length"
    label="Предмет"
    placeholder="Выберите предмет"
    :items="$subjects"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
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
  },
  methods: {
    loadSubjects,
    onSelectItem(item: DropdownItem) {
      console.log(item)
    },
  },
  mounted() {
    loadSubjects()
  },
})
</script>
