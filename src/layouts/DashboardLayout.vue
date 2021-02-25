<template>
  <div class="default-layout">
    <PageHeader />
    <div class="main">
      <Navigation />
      <div :class="{ content: true, 'opened-navigation': $isOpened }">
        <RouterView />
      </div>
    </div>
    <PageFooter />
    <ModalLogout />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PageHeader from '@/pages/common/PageHeader.vue'
import PageFooter from '@/pages/common/PageFooter.vue'
import ModalLogout from '@/pages/common/modal-logout/ModalLogout.vue'
import Navigation from '@/pages/common/navigation/Navigation.vue'
import { $isOpened } from '@/pages/common/navigation/navigation.model'

export default Vue.extend({
  name: 'DashboardLayout',
  components: { PageHeader, PageFooter, Navigation, ModalLogout },
  effector: {
    $isOpened,
  },
})
</script>

<style scoped>
.default-layout {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--base-bg-color);
  min-width: min-content;
}
.main {
  display: flex;
  min-height: calc(100vh - 90px);
}
.content {
  width: calc(100vw - 60px);
  overflow-x: auto;
  padding: 30px;
  box-sizing: border-box;
}
.opened-navigation {
  width: calc(100vw - 240px);
}
</style>


