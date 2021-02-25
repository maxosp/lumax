<template>
  <div>
    <label
      class="radio-button"
      :class="{disabled}"
    >
      <input
        type="radio"
        :name="name"
        :value="option"
        :disabled="disabled"
        :checked="isChecked"
        v-on="{
          ...$listeners,
          change: () => $emit('change', option),
        }"
      >
      <span class="inner-button" />
      <slot />
    </label>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'RadioButton',
  props: {
    value: { type: [String, Boolean] as PropType<string | boolean>, required: true },
    option: { type: [String, Boolean] as PropType<string | boolean>, required: true },
    name: { type: String as PropType<string> },
    disabled: { type: Boolean as PropType<boolean> },
  },
  model: {
    prop: 'value',
    event: 'change',
  },

  computed: {
    isChecked() {
      return this.value === this.option ? 'checked' : ''
    },
  },
})
</script>

<style scoped>
* {
  --button-border-color: var(--c-grey-12);
  --button-bg-color: transparent;
  --active-color: var(--base-text-primary);
  --font-size: var(--base-font-size);
  --text-color: var(--base-text-primary);
  --disabled-border-color: var(--button-border-color);
  --disabled-bg-color: var(--c-grey-13);
  --disabled-text-color: var(--c-grey-14);
}

.radio-button {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  font-size: var(--font-size);
  color: var(--text-color);
  line-height: 1;
  margin-bottom: 0;
  &.disabled {
    cursor: default;
    color: var(--disabled-text-color);
  }
}
input {
  position: absolute;
  left: -10000px;

  &:checked ~ .inner-button:after {
    transform: translateX(-50%) translateY(-50%) scale(1);
  }
  &:disabled ~ .inner-button {
    background-color: var(--disabled-bg-color);
    &:after {
      background-color: var(--disabled-border-color);
    }
  }
}

.inner-button {
  position: relative;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 16px;
  border: 1px solid var(--button-border-color);
  background-color: var(--button-bg-color);
  transition: background-color var(--base-animation);

  &:after {
    position: absolute;
    display: block;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%) scale(0);
    content: '';
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--active-color);
    transition: transform var(--base-animation);
  }
}
</style>


