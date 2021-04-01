<template>
  <FilterDropdown
    placeholder="Выберите задание"
    :data="$tasks"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  tasksDropdownModule,
  $tasks,
  setSelectedTasks,
} from '@/pages/preview-tasks/tasks-dropdown/tasks-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $tasks,
    ...tasksDropdownModule.store,
  },
  data() {
    return {
      themeMethods: tasksDropdownModule.methods,
    }
  },
  methods: {
    ...tasksDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      setSelectedTasks(item)
      this.$emit('setItem', item ? item.name : null)
    },
  },
})
</script>
