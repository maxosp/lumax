<template>
  <BaseDropdown
    class="dropdown"
    placeholder="Выберите язык"
    :value="$props.value.title"
    label="Язык элементов интерфейса ученика"
    read-only-dropdown
  >
    <template #default="{closeMenu}">
      <SelectItem
        v-for="item in laguages"
        :key="item.name"
        :placeholder="item.title"
        @click="handleClick(item, closeMenu)"
      >
        {{ item.title }}
      </SelectItem>
    </template>
  </BaseDropdown>
</template>

<script>
import Vue from 'vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import { LANGUAGE_DATA } from '@/pages/bank/test-tasks/create/parts/languages-dropdown/constants'

export default Vue.extend({
  name: 'LanguagesDropdown',
  components: {
    BaseDropdown,
    SelectItem,
  },
  props: {
    value: { type: Object },
  },
  data() {
    return {
      laguages: LANGUAGE_DATA,
    }
  },
  methods: {
    handleClick(item, cb) {
      this.$emit('click', item)
      cb()
    },
  },
})
</script>