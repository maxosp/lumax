<template>
  <div class="layout">
    <RouterView />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DefaultLayout',
})
</script>

<style scoped>
.layout {
  height: 100vh;
  overflow: auto;
}
</style>


