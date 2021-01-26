<template>
  <div class="error-container">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ErrorContainer',
})
</script>

<style scoped>
* {
  --text-color: white;
}
.error-container {
  padding: 20px;
  font-weight: 600;
  line-height: 1.43;
  color: var(--text-color);
  width: 270px;
}
</style>


