<template>
  <div class="checkbox-container">
    <BaseCheckbox
      v-for="item in items"
      :key="item.option"
      v-bind="item"
      class="checkbox"
      :value="isChecked(item)"
      @change="toggle(item)"
    >
      {{ item.label }}
    </BaseCheckbox>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseCheckbox from '@/ui/checkbox/BaseCheckbox.vue'

type Item = {
  option: string
  label: string
}

type Items = Item[]

export default Vue.extend({
  name: 'RadioContainer',
  components: {
    BaseCheckbox,
  },
  props: {
    value: { type: Array as PropType<string[]>, required: true },
    items: { type: Array as PropType<Items>, required: true },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  methods: {
    isChecked(item: Item) {
      return this.value.includes(item.option)
    },
    toggle(item: Item) {
      if (this.isChecked(item)) {
        this.$emit(
          'change',
          this.value.filter((option) => option !== item.option)
        )
      } else {
        this.$emit('change', [...this.value, item.option])
      }
    },
  },
})
</script>

<style scoped>
.checkbox-container {
  display: flex;
  justify-content: stretch;
  flex-direction: column;
}
.checkbox {
  margin-bottom: 10px;
  cursor: pointer;
}
</style>


