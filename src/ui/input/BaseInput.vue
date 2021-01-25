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
    maxLength: { type: Number },
  },
  model: {
    event: 'input',
    prop: 'value',
  },
})
</script>

<style scoped>
* {
  --text-color: var(--base-input-text-color);
  --side-padding: 15px;
}
.custom-dnd-placeholder {
  padding: 0 !important;
  margin-right: 10px;
}
input {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: var(--text-color);
  background-color: transparent;
  border: none;
}
</style>


