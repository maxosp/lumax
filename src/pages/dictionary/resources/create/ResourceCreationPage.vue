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
import { getThemeData } from '@/pages/dictionary/resources/create/parts/theme/theme.model'

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
    if (this.$route.params.id) {
      getThemeData(+this.$route.params.id)
    }
  },
  beforeDestroy() {
    redirectAfterSaveChanged(false)
    clearFields()
  },
})
</script>

