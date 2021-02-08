<template>
  <FilterDropdown
    v-if="$classes.length"
    label="Класс"
    placeholder="Выберите класс"
    :data="$classes"
    :methods="$props.moduleMethods"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  loadClasses,
  $classes,
  classesDropdownModule,
} from '@/pages/themes/parts/themes-filter/parts/classes-dropdown/classes-dropdown.model'
import { FilterDropdownMethods } from '@/pages/common/filter-dropdown/types'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $classes,
    ...classesDropdownModule.store,
  },
  props: {
    moduleMethods: { type: Object as PropType<FilterDropdownMethods>, required: true },
  },
  methods: {
    loadClasses,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadClasses()
  },
})
</script>
