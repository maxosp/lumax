<template>
  <FilterDropdown
    label="Модератор"
    placeholder="Выберите модератора для проверки"
    :methods="moderatorModuleMethods"
    :data="$moderators"
    :store="{ $item, $itemsDropdown, $searchString }"
    :disabled="disabled"
    @item-changed="setSelectedModerator"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  $moderators,
  moderatorDropdownModule,
  loadModerators,
  setSelectedModerator,
} from '@/pages/common/dropdowns/users/moderator-dropdown/moderator-dropdown.model'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  props: {
    disabled: { type: Boolean },
  },
  effector: {
    $moderators,
    ...moderatorDropdownModule.store,
  },
  data() {
    return {
      moderatorModuleMethods: moderatorDropdownModule.methods,
    }
  },
  methods: { setSelectedModerator },
  mounted() {
    loadModerators()
  },
})
</script>
