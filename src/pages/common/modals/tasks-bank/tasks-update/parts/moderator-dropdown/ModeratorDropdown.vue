<template>
  <FilterDropdown
    label="Модератор"
    placeholder="Выберите модератора для проверки"
    :methods="moderatorModuleMethods"
    :data="$moderators"
    :store="{ $item, $itemsDropdown, $searchString }"
    :disabled="!$canSetModerator"
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
} from '@/pages/common/modals/tasks-bank/tasks-update/parts/moderator-dropdown/moderator-dropdown.model'
import { $canSetModerator } from '@/pages/common/modals/tasks-bank/tasks-update/tasks-update-modal.model'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $moderators,
    $canSetModerator,
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
