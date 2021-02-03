<template>
  <BaseDropdown
    class="input dropdown"
    :value="correctPlaceholder"
    label="Положение темы в таксономии"
    placeholder="Тема привязана к предмету"
    :disabled="!$canSetThemePosition"
    @input="(e) => positionSearchStringChanged(e)"
  >
    <template #default="{closeMenu}">
      <SelectItem
        v-for="(item, index) in $positionDropdown"
        :key="index"
        :sub-title="item.sub"
        @click="handleClick(item.id, closeMenu)"
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
import { $canSetThemePosition } from '@/pages/theme-creation/theme-creation-page.model'
import {
  $positionDropdown,
  $position,
  positionChanged,
  $positionSearchString,
  resetSearchString,
  positionSearchStringChanged,
} from '@/pages/theme-creation/parts/position/position.model'

export default Vue.extend({
  components: {
    BaseDropdown,
    SelectItem,
  },
  effector: {
    $canSetThemePosition,
    $positionDropdown,
    $position,
    $positionSearchString,
  },
  computed: {
    correctPlaceholder() {
      const name = this.$positionDropdown.filter((el) => el.id === this.$position)
      return name.length ? name[0].title : this.$positionSearchString
    },
  },
  methods: {
    positionSearchStringChanged,
    resetSearchString,
    handleClick(item: number, cb: any) {
      positionChanged(item)
      resetSearchString()
      cb()
    },
  },
})
</script>
