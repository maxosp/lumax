<template>
  <BaseDropdown
    class="input dropdown"
    :value="correctModeratorValue"
    label="Модератор"
    placeholder="Выберите модератора для проверки"
    @input="(e) => moderatorSearchStringChanged(e)"
  >
    <template #default="{closeMenu}">
      <SelectItem
        v-for="(item, index) in $moderatorsDropdown"
        :key="index"
        :placeholder="item"
        @click="handleModeratorClick(item.id, closeMenu)"
      >
        {{ item.title }}
      </SelectItem>
    </template>
  </BaseDropdown>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import {
  $moderator,
  $moderatorsDropdown,
  $moderatorSearchString,
  resetSearchString,
  moderatorChanged,
  moderatorSearchStringChanged,
} from '@/pages/common/modals/tasks-bank/tasks-update/parts/moderator-dropdown/moderator-dropdown.model'

export default Vue.extend({
  components: {
    BaseDropdown,
    SelectItem,
  },
  effector: {
    $moderator,
    $moderatorsDropdown,
    $moderatorSearchString,
  },
  computed: {
    correctModeratorValue() {
      const name = this.$moderatorsDropdown.find((el) => el.id === this.$moderator)
      return name ? name.title : this.$moderatorSearchString
    },
  },
  methods: {
    moderatorSearchStringChanged,
    handleModeratorClick(item: number, cb: any) {
      moderatorChanged(item)
      resetSearchString()
      cb()
    },
  },
})
</script>

<style scoped>
.dropdown {
  margin-bottom: 20px;
}
</style>
