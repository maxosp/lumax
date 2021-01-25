<template>
  <div class="dashboard-layout">
    <slot name="header" />
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DashboardLayout',
})
</script>

<style scoped>
.dashboard-layout {
  position: relative;
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-auto-flow: row;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--base-bg-color);
}
</style>


