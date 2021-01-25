<template>
  <DashboardLayout>
    <template #header>
      <CabinetHeader>
        <template #center>
          <slot name="center" />
        </template>
        <template #right>
          <slot name="right" />
        </template>
      </CabinetHeader>
    </template>

    <DashboardPageLayout>
      <template #sidebar>
        <slot name="sidebar">
          <CabinetSidebar />
        </slot>
      </template>

      <slot />
    </DashboardPageLayout>
  </DashboardLayout>
</template>

<script lang="ts">
import Vue from 'vue'

import DashboardPageLayout from '@/layouts/DashboardPageLayout.vue'
import CabinetHeader from '@/features/cabinet/parts/CabinetHeader.vue'
import CabinetSidebar from '@/features/cabinet/parts/CabinetSidebar.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

export default Vue.extend({
  name: 'CabinetLayout',
  components: {
    DashboardLayout,
    DashboardPageLayout,
    CabinetHeader,
    CabinetSidebar,
  },
})
</script>

<style scoped></style>

