<template>
  <FilterDropdown
    v-if="$moderators.length"
    label="Проверяющий"
    placeholder="Выберите проверяющего"
    :data="$moderators"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  loadModerators,
  $moderators,
  moderatorDropdownModule,
  setSelectedModerator,
} from '@/pages/applications/incoming-deletion/parts/filter/parts/moderator-dropdown/moderator-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $moderators,
    ...moderatorDropdownModule.store,
  },
  methods: {
    ...moderatorDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      setSelectedModerator(item)
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadModerators()
  },
})
</script>
