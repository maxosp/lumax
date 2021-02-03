<template>
  <div class="theme-page">
    <ThemeHeader />
    <ThemeContent />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/pages/theme-creation/parts/Header.vue'
import Content from '@/pages/theme-creation/parts/Content.vue'

export default Vue.extend({
  name: 'ThemeCreationPage',
  components: {
    ThemeHeader: Header,
    ThemeContent: Content,
  },
})
</script>

