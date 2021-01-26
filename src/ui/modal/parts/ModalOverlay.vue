<template>
  <div class="modal-overlay">
    <div class="content-wrap">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Modal',
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  display: flex;
  align-items: stretch;
  justify-content: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--modal-overlay-color);
  z-index: 100;
}
.content-wrap {
  display: flex;
  align-items: center;
}
</style>


