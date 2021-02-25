<template>
  <div class="header">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Block',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
})
</script>

<style scoped>
.header {
  width: 100%;
  background-color: #fff;
  border-radius: 3px;
}
</style>
