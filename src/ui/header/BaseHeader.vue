<template>
  <div class="base-header">
    <div class="left-section">
      <slot name="left" />
    </div>
    <div class="center-section">
      <slot name="center" />
    </div>
    <div class="right-section">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'BaseHeader',
})
</script>

<style scoped>
* {
  --bg-color: var(--header-bg-color);
}
.base-header {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas: 'buttons utils users';
  background-color: var(--bg-color);
  height: var(--header-height);
}
.left-section {
}
.center-section {
}
.right-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>


