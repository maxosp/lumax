<template>
  <div class="container">
    Content
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
})
</script>

<style lang="scss" scoped>
.container {
  @include flex-middle;
  background-color: $layout-background;
  border-radius: 15px;
  color: #fff;
  padding: 45px $column-width;
}
</style>
