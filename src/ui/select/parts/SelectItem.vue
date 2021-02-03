<template>
  <div
    class="select-item"
    :class="{active}"
    v-on="$listeners"
  >
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'SelectItem',

  props: {
    active: { type: Boolean as PropType<boolean> },
  },
})
</script>

<style scoped>
* {
  --side-padding: var(--inputs-inner-side-padding);
  --bg-color: transparent;
  --bg-hover-color: rgba(193, 193, 193, 0.11);
  --bg-active-color: var(--c-yellow-1);
  --text-color: var(--base-text-primary);
  --border-color: transparent;
  --after-active-color: var(--base-text-primary);
}

.select-item {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 51px;
  font-size: 14px;
  color: var(--text-color);
  background-color: var(--bg-color);
  transition: background-color var(--base-animation);
  cursor: pointer;

  &:hover {
    background-color: var(--bg-hover-color);
  }

  &.active {
    background-color: var(--bg-active-color);
    &:after {
      background-color: var(--after-active-color);
    }
  }

  &:after {
    position: absolute;
    content: '';
    width: 4px;
    top: -1px;
    bottom: -1px;
    right: 0;
    background-color: transparent;
    transition: background-color var(--base-animation);
  }
}

.content {
  display: flex;
  align-items: center;
  height: 51px;
  width: 95%;
  margin: 0 7px;
  padding: 0 7px;
  border-bottom: 1px solid var(--border-color);
}
</style>


