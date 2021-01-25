<template>
  <div id="app">
    <router-view />
    <ToastsContainer />
  </div>
</template>

<script lang="ts">
import ToastsContainer from '@/features/toasts/ToastsContainer.vue'

export default {
  components: { ToastsContainer },
}
</script>


