<template>
  <textarea
    class="base-textarea"
    :maxlength="maxLength"
    v-bind="$props"
    v-on="{
      ...$listeners,
      input: (e) => $emit('input', e.target.value),
    }"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'BaseTextarea',
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
.base-textarea {
  resize: none;
  min-height: 120px;
  width: 100%;
  background: var(--c-grey-5);
  border: 1px solid var(--c-grey-5);
  padding: 15px;
  border-radius: 8px;

  &:focus {
    background: #fff;
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }
}
</style>


