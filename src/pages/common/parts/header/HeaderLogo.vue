<template>
  <div class="logo-wrap">
    <RouterLink :to="{ name: 'home' }" class="link">
      <img
        src="~assets/img/logo.svg"
        alt="logo"
        class="logo"
      >
    </RouterLink>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'HeaderLogo',
})
</script>

<style scoped>
.logo-wrap {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
}
.logo {
  width: 97px;
  height: 36px;
}
.link {
  text-decoration: none;
  color: #fff;
}
</style>


