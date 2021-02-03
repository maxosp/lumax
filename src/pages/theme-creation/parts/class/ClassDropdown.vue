<template>
  <BaseDropdown
    class="input dropdown"
    :value="correctClassValue"
    label="Класс"
    placeholder="Выберите класс"
    @input="(e) => classSearchStringChanged(e)"
  >
    <template #default="{closeMenu}">
      <SelectItem
        v-for="(item, index) in $classDropdown"
        :key="index"
        :placeholder="item"
        @click="handleClassClick(item, closeMenu)"
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
  $class,
  classChanged,
  $classDropdown,
  $classSearchString,
  classSearchStringChanged,
  resetSearchString,
} from '@/pages/theme-creation/parts/class/class.model'

export default Vue.extend({
  components: {
    BaseDropdown,
    SelectItem,
  },
  effector: {
    $class,
    $classDropdown,
    $classSearchString,
  },
  computed: {
    correctClassValue() {
      return this.$class ? `${this.$class}` : this.$classSearchString
    },
  },
  methods: {
    classChanged,
    resetSearchString,
    classSearchStringChanged,
    handleClassClick(item: number, cb: any) {
      classChanged(item)
      resetSearchString()
      cb()
    },
  },
})
</script>
