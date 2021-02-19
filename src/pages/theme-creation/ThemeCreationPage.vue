<template>
  <div class="theme-page">
    <ThemeHeader />
    <ThemeContent />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ThemeHeader from '@/pages/theme-creation/parts/Header.vue'
import ThemeContent from '@/pages/theme-creation/parts/Content.vue'
import {
  $formToSend,
  $formToSendPrerequisite,
  clearFields,
  redirectAfterSaveChanged,
  pareparePageForEditing,
} from '@/pages/theme-creation/theme-creation-page.model'

export default Vue.extend({
  name: 'ThemeCreationPage',
  effector: {
    $formToSend,
    $formToSendPrerequisite,
  },
  components: {
    ThemeHeader,
    ThemeContent,
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

