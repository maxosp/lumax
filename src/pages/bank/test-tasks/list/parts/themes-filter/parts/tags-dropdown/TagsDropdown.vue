<template>
  <FilterDropdown
    v-if="$tags.length"
    label="Метки заданий"
    placeholder="Выберите метку"
    :data="$tags"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  tagsDropdownModule,
  loadTags,
  $tags,
} from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/tags-dropdown/tags-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $tags,
    ...tagsDropdownModule.store,
  },
  methods: {
    ...tagsDropdownModule.methods,
    loadTags,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadTags()
  },
})
</script>
