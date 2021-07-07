<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    :class="[
      $style['base-button'],
      isBorder ? $style['is-border'] : '',
      disabled ? $style['disabled'] : '',
      customClasses
    ]"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppButton',
  props: {
    isBorder: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    customClasses: { type: String, default: '' }
  }
})
</script>

<style lang="scss" module>
.base-button {
  font-family: 'Panton Regular', serif;
  font-size: 18px;
  color: white;
  background-color: $secondary-color;
  border-radius: 15px;
  padding: 15px 40px;

  transition: all ease 1sec;
  box-shadow: $box-shadow;

  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    background-color: $primary-color;
    color: black;
  }
}

.is-border {
  border: 1px solid $primary-color;
}
</style>
