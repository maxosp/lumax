<template>
  <DashboardLayout>
    <template #header>
      <CommonPageHeader />
    </template>
    <RouterView />
    <CommonPageFooter />
  </DashboardLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import CommonPageHeader from '@/pages/common/CommonPageHeader.vue'
import CommonPageFooter from '@/pages/common/CommonPageFooter.vue'

export default Vue.extend({
  name: 'CommonPageLayout',
  components: { DashboardLayout, CommonPageHeader, CommonPageFooter },
})
</script>


