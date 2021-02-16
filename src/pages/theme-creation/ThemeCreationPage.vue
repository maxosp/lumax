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
import {
  $formToSend,
  clearFields,
  redirectAfterSaveChanged,
  pareparePageForEditing,
} from '@/pages/theme-creation/theme-creation-page.model'

export default Vue.extend({
  name: 'ThemeCreationPage',
  components: {
    ThemeHeader: Header,
    ThemeContent: Content,
  },
  effector: {
    $formToSend,
  },
  methods: { redirectAfterSaveChanged, clearFields, pareparePageForEditing },
  mounted() {
    if (this.$route.params.id) pareparePageForEditing(+this.$route.params.id)
  },
  beforeDestroy() {
    redirectAfterSaveChanged(false)
    clearFields()
  },
})
</script>

