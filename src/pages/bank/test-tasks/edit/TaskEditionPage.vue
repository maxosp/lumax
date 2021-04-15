<template>
  <div class="test-task-creation">
    <TaskHeader
      title="Редактирование тестового задания"
      :disabled="!$canSave"
      :is-preview="$isPreview"
      :status="$status"
      @onReview="sendToModerationAssignments"
      @toggle="toggleIsPreview"
      @save="saveTask(false)"
      @saveAndBackToList="saveTask(true)"
    />
    <SelectTaskBlock @onLoadTask="val => loadTask(val)" />
    <TaskContent />
    <TaskFooter
      :disabled="!$canSave"
      @save="saveTask(false)"
      @saveAndBackToList="saveTask(true)"
    />
    <ModeratorSelectModal type="test" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TaskHeader from '@/pages/bank/common/parts/Header.vue'
import TaskContent from '@/pages/bank/test-tasks/edit/parts/Content.vue'
import TaskFooter from '@/pages/bank/common/parts/Footer.vue'
import SelectTaskBlock from '@/pages/bank/common/parts/SelectTaskBlock.vue'
import ModeratorSelectModal from '@/pages/bank/common/modals/moderator-select/ModeratorSelectModal.vue'
import {
  save,
  $canSave,
  loadTask,
  setRedirectAfterSave,
  clearFields,
  $isPreview,
  toggleIsPreview,
  $taskId,
  $status,
} from '@/pages/bank/test-tasks/edit/task-edition-page.model'
import { $token } from '@/features/api/common/request'
import {
  loadModalToSendForCheck,
  $canRefreshAfterSendingForModeration,
} from '@/pages/bank/common/modals/moderator-select/moderator-select.model'

export default Vue.extend({
  name: 'TaskEditionPage',
  components: {
    TaskHeader,
    TaskContent,
    TaskFooter,
    SelectTaskBlock,
    ModeratorSelectModal,
  },
  effector: {
    $canSave,
    $isPreview,
    $taskId,
    $token,
    $status,
    $canRefreshAfterSendingForModeration,
  },
  data: () => ({
    questions: [] as string[],
  }),
  watch: {
    $isPreview: {
      handler(newVal) {
        if (newVal) {
          this.$router.push({
            name: 'preview-task',
            query: {
              questions: this.questions.length ? this.questions.join(',') : `${this.$taskId}`,
              type: 'test-assignment',
              token: this.$token,
              application: 'true',
            },
          })
        }
      },
    },
    $canRefreshAfterSendingForModeration: {
      handler(newVal) {
        if (newVal) loadTask(+this.$route.params.id)
      },
    },
  },
  methods: {
    loadTask,
    toggleIsPreview,
    sendToModerationAssignments() {
      loadModalToSendForCheck([this.$taskId])
    },
    saveTask(isRedirect: boolean) {
      save()
      if (isRedirect) {
        setRedirectAfterSave(true)
      }
    },
  },
  mounted() {
    const { questions } = this.$route.query
    if (questions && typeof questions === 'string') {
      this.questions = questions.split(',')
    }
  },
  beforeDestroy() {
    clearFields()
    toggleIsPreview(false)
  },
  created() {
    loadTask(+this.$route.params.id)
  },
})
</script>

