<template>
  <div>
    <label>
      <input
        :checked="checked"
        type="checkbox"
        @change="$emit('change', !checked)"
      >
      <span
        class="body"
        :class="{checked}"
      >
        <span class="dot" />
      </span>
      <span class="text">
        <slot />
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'BaseSwitch',
  props: {
    checked: { type: Boolean as PropType<boolean> },
  },
  model: {
    event: 'change',
    prop: 'checked',
  },
})
</script>

<style scoped>
* {
  --bg-color: var(--c-grey-2);
  --dot-color: #fff;

  --bg-active-color: var(--c-yellow-1);
  --dot-passive-color: white;

  --switch-width: 44px;
  --dot-size: 20px;
  --dot-side-margin: 2px;
  --dot-active-transform: calc(var(--switch-width) - var(--dot-size) - var(--dot-side-margin) * 2);
}
label {
  display: flex;
  align-items: center;
  cursor: pointer;
}
input {
  opacity: 0;
  width: 0;
  height: 0;
}
.body {
  position: relative;
  display: flex;
  align-items: center;
  width: var(--switch-width);
  height: 24px;
  border-radius: 20px;
  background-color: var(--bg-color);
  transition: background-color var(--base-animation);
  &.checked {
    background-color: var(--bg-active-color);
    & .dot {
      transform: translateX(var(--dot-active-transform));
    }
  }
}
.dot {
  position: absolute;
  top: 2px;
  left: 2px;
  display: block;
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 50%;
  background-color: var(--dot-passive-color);
  transition: background-color var(--base-animation), transform var(--base-animation);
}
.text {
  color: var(--base-text-primary);
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  margin-left: 10px;
}
</style>


