<template>
  <BaseDropdown
    class="input dropdown"
    :value="correctSubjectValue"
    label="Предмет"
    placeholder="Выберите предмет"
    @input="(e) => subjectSearchStringChanged(e)"
  >
    <template #default="{closeMenu}">
      <SelectItem
        v-for="(item, index) in $subjectsDropdown"
        :key="index"
        :placeholder="item"
        @click="handleSubjectClick(item.id, closeMenu)"
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
  $subject,
  $subjectsDropdown,
  $subjectSearchString,
  resetSearchString,
  subjectChanged,
  subjectSearchStringChanged,
} from '@/pages/theme-creation/parts/subjects/subjects.model'

export default Vue.extend({
  components: {
    BaseDropdown,
    SelectItem,
  },
  effector: {
    $subject,
    $subjectsDropdown,
    $subjectSearchString,
  },
  computed: {
    correctSubjectValue() {
      const name = this.$subjectsDropdown.filter((el) => el.id === this.$subject)
      return name.length ? name[0].title : this.$subjectSearchString
    },
  },
  methods: {
    subjectSearchStringChanged,
    handleSubjectClick(item: number, cb: any) {
      subjectChanged(item)
      resetSearchString()
      cb()
    },
  },
})
</script>
