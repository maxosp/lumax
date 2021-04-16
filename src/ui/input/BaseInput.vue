<template>
  <input
    v-bind="$props"
    :maxlength="maxLength"
    v-on="{
      ...$listeners,
      input: (e) => $emit('input', e.target.value),
    }"
  >
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'BaseInput',
  props: {
    value: { type: [String, Number] as PropType<string | number>, default: '' },
    placeholder: { type: String as PropType<string>, default: '' },
    maxLength: { type: Number },
    disabled: { type: Boolean },
    type: { type: String as PropType<string>, default: '' },
  },
  model: {
    event: 'input',
    prop: 'value',
  },
})
</script>

<style scoped>
input::after {
  content: '*';
}
</style>