<template>
  <div class="header-utils">
    <SidebarMenu />
    <HeaderLogo />
    <NotificationsBox />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import SidebarMenu from '@/features/common/sidebar/SidebarMenu.vue'
import HeaderLogo from '@/features/common/header/HeaderLogo.vue'
import NotificationsBox from '@/features/common/notifications/NotificationsBox.vue'

export default Vue.extend({
  name: 'HeaderUtils',
  components: { SidebarMenu, HeaderLogo, NotificationsBox },
})
</script>

<style scoped>
.header-utils {
  display: flex;
  align-items: stretch;
  height: 100%;
}
.logo-wrap {
  margin-right: 20px;
}
</style>


