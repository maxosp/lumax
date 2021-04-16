<template>
  <div class="test-task-creation">
    <TaskHeader
      title="Создание тeста"
      :disabled="!$canSave"
      @save="saveTask(false)"
      @saveAndBackToList="saveTask(true)"
    />
    <TaskContent />
    <TestFooter
      :disabled="!$canSave"
      @save="saveTask(false)"
      @saveAndBackToList="saveTask(true)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TaskHeader from '@/pages/bank/common/parts/Header.vue'
import TaskContent from '@/pages/testing/tests/create/parts/Content.vue'
import TestFooter from '@/pages/common/parts/tests/parts/page-footer/TestFooter.vue'

import {
  trySave,
  $canSave,
  setRedirectAfterSave,
  clearFields,
} from '@/pages/testing/tests/create/test-create-page.model'

export default Vue.extend({
  name: 'TaskCreationPage',
  components: {
    TaskHeader,
    TaskContent,
    TestFooter,
  },
  effector: {
    $canSave,
  },
  methods: {
    saveTask(isRedirect: boolean) {
      trySave()
      if (isRedirect) setRedirectAfterSave(true)
    },
  },
  beforeDestroy() {
    clearFields()
  },
})
</script>

