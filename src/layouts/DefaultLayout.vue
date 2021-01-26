<template>
  <div class="default-layout">
    <PageHeader />
    <div class="main">
      <Navigation />
      <div class="content">
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

export default Vue.extend({
  name: 'DefaultLayout',
  components: { PageHeader, PageFooter, Navigation, ModalLogout },
})
</script>

<style scoped>
.default-layout {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--base-bg-color);
}
.main {
  display: flex;
  min-height: calc(100vh - 90px);
}
</style>


