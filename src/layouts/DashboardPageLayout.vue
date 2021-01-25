<template>
  <div class="dashboard-page-container">
    <div
      class="sidebar-wrap"
    >
      <slot name="sidebar" />
    </div>

    <div
      class="content-wrap"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DashboardPageLayout',
})
</script>

<style scoped>
.dashboard-page-container {
  position: relative;
  display: flex;
  align-items: stretch;
  background-color: var(--base-bg-color);
}
.sidebar-wrap {
  top: 0;
  left: 0;
  flex: 0;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.26);
}
.content-wrap {
  flex: 1 1 100%;
  position: relative;
  overflow-x: hidden;
  padding: 0 20px;
}
</style>


