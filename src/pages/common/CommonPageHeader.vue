<template>
  <BaseHeader class="cabinet-header">
    <template #left>
      <router-link :to="{ name: 'home' }">
        <HeaderLogo />
      </router-link>
    </template>
    <template #right>
      <HeaderLink route-name="common.faq">
        FAQ
      </HeaderLink>
      <HeaderLink route-name="common.contacts">
        Контакты
      </HeaderLink>
      <HeaderLink
        v-if="!false"
        route-name="auth.login"
      >
        Войти
      </HeaderLink>
    </template>
  </BaseHeader>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseHeader from '@/ui/header/BaseHeader.vue'
import HeaderLogo from '@/pages/common/parts/header/HeaderLogo.vue'
import HeaderLink from '@/pages/common/parts/header/HeaderLink.vue'
// import { $isAuthed } from '@/features/session'

export default Vue.extend({
  name: 'CommonPageHeader',
  components: { BaseHeader, HeaderLogo, HeaderLink },
  // effector: {
  //   $isAuthed,
  // },
})
</script>

<style scoped>
.cabinet-header {
  padding-left: 30px;
  padding-right: 0;
}
</style>


