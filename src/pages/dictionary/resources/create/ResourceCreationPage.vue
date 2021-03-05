<template>
  <div class="theme-page">
    <ResourcesHeader
      title="Добавление обучающего ресурса"
      @save="create"
      @saveWithRedirect="createWithRedirect"
    />
    <ResourceContent />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ResourcesHeader from '@/pages/dictionary/resources/create/parts/header/Header.vue'
import ResourceContent from '@/pages/dictionary/resources/create/parts/Content.vue'
import {
  create,
  $formToSend,
  clearFields,
  redirectAfterSaveChanged,
} from '@/pages/dictionary/resources/create/resource-creation-page.model'
// import { subjectDropdownModule } from '@/pages/dictionary/themes/create/parts/subjects/subjects.model'
// import { classDropdownModule } from '@/pages/dictionary/themes/create/parts/class/class.model'
// import { positionDropdownModule } from '@/pages/dictionary/themes/create/parts/position/position.model'

export default Vue.extend({
  name: 'ResourceCreationPage',
  effector: {
    $formToSend,
  },
  components: {
    ResourcesHeader,
    ResourceContent,
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
      // const { subject, studyYear, theme } = this.$route.params
      // // subject && subjectDropdownModule.methods.itemChanged(subject)
      // // studyYear && classDropdownModule.methods.itemChanged(studyYear)
      // // theme && positionDropdownModule.methods.itemChanged(theme)
    }
  },
  beforeDestroy() {
    redirectAfterSaveChanged(false)
    clearFields()
  },
})
</script>

