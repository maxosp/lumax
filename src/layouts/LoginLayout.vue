<template>
  <div class="login-layout">
    <RouterView />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LoginLayout',
})
</script>

<style scoped>
.login-layout {
  width: 100%;
  height: 100%;
  @mixin flex-center;
  background-image: url('~assets/img/login-bg.jpg');
  background-size: cover;
  background-position: center;
  border-bottom: 6px solid var(--c-yellow-1);
}
</style>
