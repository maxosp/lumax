<template>
  <div
    class="radio-container"
    :class="direction"
  >
    <RadioButton
      v-for="item in items"
      :key="item.option"
      class="button"
      v-bind="item"
      :disabled="disabled"
      :value="value"
      @change="val => $emit('change', val)"
    >
      {{ item.label }}
    </RadioButton>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import RadioButton from './RadioButton.vue'

type Items = {
  name?: string
  option: string | boolean
  label: string
}[]

export default Vue.extend({
  name: 'RadioContainer',
  components: {
    RadioButton,
  },
  props: {
    value: { type: String as PropType<string>, required: true },
    items: { type: Array as PropType<Items>, required: true },
    direction: { type: String as PropType<'horizontal' | 'vertical'>, default: 'vertical' },
    disabled: { type: Boolean as PropType<boolean> },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
})
</script>

<style scoped>
.radio-container {
  display: flex;

  &.horizontal {
    justify-content: stretch;
    flex-direction: row;
    & .button {
      margin-right: 15px;
    }
  }
  &.vertical {
    align-items: stretch;
    flex-direction: column;
    & .button {
      margin-bottom: 15px;
    }
  }
}
.button {
  &:last-of-type {
    margin-bottom: 0 !important;
    margin-right: 0 !important;
  }
}
</style>


