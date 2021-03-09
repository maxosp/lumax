<template>
  <div class="resource-page">
    <ResourceHeader
      title="Редактирование обучающего ресурса"
      @save="edit"
      @saveWithRedirect="editWithRedirect"
    />
    <ResourceContent />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ResourceHeader from '@/pages/dictionary/resources/edit/parts/header/Header.vue'
import ResourceContent from '@/pages/dictionary/resources/edit/parts/Content.vue'
import {
  $formToSend,
  clearFields,
  redirectAfterSaveChanged,
  getResourceToUpdate,
  edit,
} from '@/pages/dictionary/resources/edit/resource-edition-page.model'

export default Vue.extend({
  name: 'ResourceCreationPage',
  effector: {
    $formToSend,
  },
  components: {
    ResourceHeader,
    ResourceContent,
  },
  methods: {
    redirectAfterSaveChanged,
    clearFields,
    getResourceToUpdate,
    edit,
    editWithRedirect() {
      redirectAfterSaveChanged(true)
      edit()
    },
  },
  mounted() {
    getResourceToUpdate(+this.$route.params.id)
  },
  beforeDestroy() {
    redirectAfterSaveChanged(false)
    clearFields()
  },
})
</script>

