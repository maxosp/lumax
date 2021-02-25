<template>
  <div class="logo-wrap">
    <RouterLink :to="{ name: 'home' }" class="link">
      <img
        v-if="$isOpened"
        src='~assets/img/logo-full.svg'
        alt="logo"
        class="logo"
      >
      <img
        v-else
        src='~assets/img/logo.svg'
        alt="logo"
        class="logo"
      >
    </RouterLink>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { $isOpened } from '@/pages/common/navigation/navigation.model'

export default Vue.extend({
  name: 'HeaderLogo',
  effector: {
    $isOpened,
  },
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


