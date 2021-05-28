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
import ThemeHeader from '@/pages/dictionary/themes/create/parts/header/Header.vue'
import ThemeContent from '@/pages/dictionary/themes/create/parts/Content.vue'
import {
  create,
  $formToSend,
  $formToSendPrerequisite,
  clearFields,
  redirectAfterSaveChanged,
} from '@/pages/dictionary/themes/create/theme-creation-page.model'
import { $isPrerequisite } from '@/pages/dictionary/themes/create/parts/header/header.model'
import {
  subjectDropdownModule,
  setSelectedSubject,
} from '@/pages/dictionary/themes/create/parts/subjects/subjects.model'
import {
  classDropdownModule,
  setSelectedClass,
} from '@/pages/dictionary/themes/create/parts/class/class.model'
import { positionDropdownModule } from '@/pages/dictionary/themes/create/parts/position/position.model'

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
      subject && setSelectedSubject({ id: +subject, name: subject, title: subject })
      studyYear && classDropdownModule.methods.itemChanged(studyYear)
      studyYear && setSelectedClass({ id: +studyYear, name: studyYear, title: studyYear })
      theme && positionDropdownModule.methods.itemChanged(theme)
    }
  },
  beforeDestroy() {
    redirectAfterSaveChanged(false)
    clearFields()
  },
})
</script>

