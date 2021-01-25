<template>
  <BaseHeader>
    <template #left>
      <div :class="{ 'header-logo': true, opened: $isOpened }">
        <router-link :to="{ name: 'home' }">
          <HeaderLogo />
        </router-link>
      </div>
    </template>
    <template #center>
      <div class="nav-state-switcher">
        <div @click="changeNavState(!$isOpened)">Click me</div>
      </div>
    </template>
    <template #right>
      <div class="header-auth">
        <HeaderLink route-name="user.profile">
          Никита Махаев
        </HeaderLink>
        <HeaderLink
          v-if="!false"
          :style="'text-decoration-line: underline;'"
          route-name="auth.login"
        >
          Выйти
        </HeaderLink>
      </div>
    </template>
  </BaseHeader>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseHeader from '@/ui/header/BaseHeader.vue'
import HeaderLogo from '@/pages/common/parts/header/HeaderLogo.vue'
import HeaderLink from '@/pages/common/parts/header/HeaderLink.vue'
import { $isOpened, changeNavState } from '@/pages/common/Navigation/navigation.model.ts'
// import { $isAuthed } from '@/features/session'

export default Vue.extend({
  name: 'PageHeader',
  components: { BaseHeader, HeaderLogo, HeaderLink },
  effector: {
    // $isAuthed,
    $isOpened,
  },
  methods: {
    changeNavState,
  },
})
</script>

<style scoped>
.header-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  transition: width var(--base-animation);
}
.opened {
  width: 240px;
}
.header-auth {
  display: flex;
  justify-content: flex-end;
  min-width: 300px;
}
</style>



