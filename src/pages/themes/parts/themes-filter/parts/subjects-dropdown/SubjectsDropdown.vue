<template>
  <FilterDropdown
    v-if="$subjects.length"
    label="Предмет"
    placeholder="Выберите предмет"
    :data="$subjects"
    :methods="$props.moduleMethods"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  subjectsDropdownModule,
  loadSubjects,
  $subjects,
} from '@/pages/themes/parts/themes-filter/parts/subjects-dropdown/subjects-dropdown.model'
import { FilterDropdownMethods } from '@/pages/common/filter-dropdown/types'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $subjects,
    ...subjectsDropdownModule.store,
  },
  props: {
    moduleMethods: { type: Object as PropType<FilterDropdownMethods>, required: true },
  },
  methods: {
    loadSubjects,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadSubjects()
  },
})
</script>
