<template>
  <BaseDropdown
    class="input dropdown"
    :value="$difficulty"
    label="Сложность"
    placeholder="Выберите предмет"
  >
    <template #default="{closeMenu}">
      <SelectItem
        v-for="(item, index) in $difficultysDropdown"
        :key="index"
        :placeholder="item"
        @click="handleSubjectClick(item, closeMenu)"
      >
        {{ item }}
      </SelectItem>
    </template>
  </BaseDropdown>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import {
  $difficulty,
  $difficultysDropdown,
  difficultyChanged,
} from '@/pages/common/modals/tasks-bank/tasks-update/parts/difficulty-dropdown/difficulty.model'

export default Vue.extend({
  components: {
    BaseDropdown,
    SelectItem,
  },
  effector: {
    $difficulty,
    $difficultysDropdown,
  },
  methods: {
    difficultyChanged,
    handleSubjectClick(item: string, cb: any) {
      difficultyChanged(item)
      cb()
    },
  },
})
</script>
