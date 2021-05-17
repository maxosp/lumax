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
} from '@/pages/preview-tasks/parts/tasks-dropdown/tasks-dropdown.model'
import { DropdownItem } from '@/pages/common/types'
import { $currentIndex } from '@/pages/preview-tasks/parts/select-task/select-task.model'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $tasks,
    $currentIndex,
    ...tasksDropdownModule.store,
  },
  watch: {
    $tasks: {
      handler() {
        this.setCurrentTaskNameIntoDd()
      },
    },
  },
  methods: {
    ...tasksDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      setSelectedTasks(item)
      this.$emit('setItem', item ? item.name : null)
    },
    setCurrentTaskNameIntoDd() {
      tasksDropdownModule.methods.itemChanged(this.$tasks[this.$currentIndex].name)
    },
  },
  mounted() {
    this.setCurrentTaskNameIntoDd()
  },
})
</script>
