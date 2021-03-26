<template>
  <div class="resizable-block">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: `ResizableBlock`,
})
</script>

<style scoped>
.resizable-block {
  position: absolute;
  background: #888;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-style: dashed;
  box-sizing: border-box;
}
</style>