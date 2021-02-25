<template>
  <div class="subject-page">
    <SubjectHeader />
    <SubjectContent />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SubjectHeader from '@/pages/subjects/create/parts/Header.vue'
import SubjectContent from '@/pages/subjects/create/parts/Content.vue'
import {
  $formToSend,
  clearFields,
  redirectAfterSaveChanged,
  pareparePageForEditing,
} from '@/pages/subjects/create/subjects-creation-page.model'

export default Vue.extend({
  name: 'SubjectCreationPage',
  effector: {
    $formToSend,
  },
  components: { SubjectHeader, SubjectContent },
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
