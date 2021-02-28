<template>
  <div class="theme-page">
    <ThemeHeader
      :title="correctTitle"
      @save="create"
      @saveWithRedirect="createWithRedirect"
    />
    <ThemeContent />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ThemeHeader from '@/pages/theme-creation/parts/header/Header.vue'
import ThemeContent from '@/pages/theme-creation/parts/Content.vue'
import {
  create,
  $formToSend,
  $formToSendPrerequisite,
  clearFields,
  redirectAfterSaveChanged,
} from '@/pages/theme-creation/theme-creation-page.model'
import { $isPrerequisite } from '@/pages/theme-creation/parts/header/header.model'
import { subjectDropdownModule } from '@/pages/theme-creation/parts/subjects/subjects.model'
import { classDropdownModule } from '@/pages/theme-creation/parts/class/class.model'
import { positionDropdownModule } from '@/pages/theme-creation/parts/position/position.model'

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
      return `Создание ${this.$isPrerequisite ? 'пререквизита' : 'темы'}`
    },
  },
  methods: {
    redirectAfterSaveChanged,
    clearFields,
    create,
    createWithRedirect() {
      redirectAfterSaveChanged(true)
      create()
    },
  },
  mounted() {
    if (this.$route.params) {
      const { subject, studyYear, theme } = this.$route.params
      subject && subjectDropdownModule.methods.itemChanged(subject)
      studyYear && classDropdownModule.methods.itemChanged(studyYear)
      theme && positionDropdownModule.methods.itemChanged(theme)
    }
  },
  beforeDestroy() {
    redirectAfterSaveChanged(false)
    clearFields()
  },
})
</script>

