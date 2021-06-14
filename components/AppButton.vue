<template>
  <button
    v-bind="$props"
    v-on="$listeners"
    class="base-button"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppButton',
  props: {
    disabled: { type: Boolean, default: false }
  }
})
</script>

<style lang="scss" scoped>
.base-button {
  font-family: 'Panton Regular', serif;
  font-size: 18px;
  color: black;
  line-height: 1;
  background-color: $primary-color;
  border-radius: 15px;
  padding: 15px 40px;
  text-transform: uppercase;
  cursor: pointer;
}
</style>
