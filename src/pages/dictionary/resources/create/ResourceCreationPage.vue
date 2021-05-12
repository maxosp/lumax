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
  initAssignment,
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
    const { id, theme, subject } = this.$route.params
    if (id) {
      getThemeData(+id)
    }
    if (theme && subject && this.$route.params.class) {
      initAssignment.prepend(() => ({
        theme: +theme,
        subject: +subject,
        class: +this.$route.params.class,
      }))()
    }
  },
  beforeDestroy() {
    redirectAfterSaveChanged(false)
    clearFields()
  },
})
</script>

