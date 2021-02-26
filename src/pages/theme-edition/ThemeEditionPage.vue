<template>
  <div class="theme-page">
    <ThemeHeader
      :title="correctTitle"
      @save="edit"
      @saveWithRedirect="editWithRedirect"
    />
    <ThemeContent />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ThemeHeader from '@/pages/theme-edition/parts/header/Header.vue'
import ThemeContent from '@/pages/theme-edition/parts/Content.vue'
import {
  $formToSend,
  $formToSendPrerequisite,
  clearFields,
  redirectAfterSaveChanged,
  getThemeToUpdate,
  edit,
} from '@/pages/theme-edition/theme-edition-page.model'
import { $isPrerequisite } from '@/pages/theme-creation/parts/header/header.model'

export default Vue.extend({
  name: 'ThemeCreationPage',
  effector: {
    $formToSend,
    $formToSendPrerequisite,
    $isPrerequisite,
  },
  components: {
    ThemeHeader,
    ThemeContent,
  },
  computed: {
    correctTitle() {
      return `Редактирование ${this.$isPrerequisite ? 'пререквизита' : 'темы'}`
    },
  },
  methods: {
    redirectAfterSaveChanged,
    clearFields,
    getThemeToUpdate,
    edit,
    editWithRedirect() {
      redirectAfterSaveChanged(true)
      edit()
    },
  },
  mounted() {
    getThemeToUpdate(+this.$route.params.id)
  },
  beforeDestroy() {
    redirectAfterSaveChanged(false)
    clearFields()
  },
})
</script>

