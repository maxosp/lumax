<template>
  <button
    v-bind="$props"
    :class="{borderWithoutBg}"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'BaseButton',
  props: {
    borderWithoutBg: { type: Boolean },
    disabled: { type: Boolean as PropType<boolean>, default: false },
  },
})
</script>

<style scoped>
button {
  width: 100%;
  @mixin flex-center;
  border: none;
  padding: 0 30px;
  background-color: var(--base-text-primary);
  color: white;
  font-weight: 700;
  line-height: 17px;
  height: 46px;
  border-radius: 7px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }

  &.borderWithoutBg {
    background: transparent;
    border: 2px solid var(--base-text-primary);
    color: var(--base-text-primary);
    &:disabled {
      opacity: 0.5;
    }
  }
}
</style>
