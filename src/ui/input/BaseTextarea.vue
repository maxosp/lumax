<template>
  <label>
    <span class="label">
      {{ label }}
    </span>
    <textarea
      class="base-textarea"
      :maxlength="maxLength"
      v-bind="$props"
      :placeholder="placeholder"
      v-on="{
        ...$listeners,
        input: (e) => $emit('input', e.target.value),
      }"
    />
  </label>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'BaseTextarea',
  props: {
    value: { type: [String, Number] as PropType<string | number>, default: '' },
    maxLength: { type: Number },
    placeholder: { type: String as PropType<string> },
    label: { type: String as PropType<string> },
  },
  model: {
    event: 'input',
    prop: 'value',
  },
})
</script>

<style scoped>
label {
  display: block;
}
.label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
}
.base-textarea {
  resize: none;
  min-height: 120px;
  width: 100%;
  background: var(--c-grey-4);
  border: 1px solid var(--c-grey-4);
  padding: 15px;
  border-radius: 5px;

  &:focus {
    background: #fff;
  }

  &::placeholder {
    color: var(--c-grey-1);
  }
}
</style>


