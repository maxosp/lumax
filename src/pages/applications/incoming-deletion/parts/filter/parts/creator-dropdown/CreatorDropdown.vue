<template>
  <FilterDropdown
    v-if="$creators.length"
    label="Создатель"
    placeholder="Выберите создателя"
    :data="$creators"
    :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="onSelectItem"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  loadCreators,
  $creators,
  creatorDropdownModule,
  setSelectedCreator,
} from '@/pages/applications/incoming-deletion/parts/filter/parts/creator-dropdown/creator-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $creators,
    ...creatorDropdownModule.store,
  },
  methods: {
    ...creatorDropdownModule.methods,
    onSelectItem(item: DropdownItem | null) {
      setSelectedCreator(item)
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadCreators()
  },
})
</script>
