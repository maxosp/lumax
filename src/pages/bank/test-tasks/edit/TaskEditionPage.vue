<template>
  <div class="test-task-creation">
    <TaskHeader
      title="Редактирование тестового задания"
      :disabled="!$canSave"
      :is-preview="$isPreview"
      :from-page="fromPage"
      task-type="test-assignment"
      @onReview="sendToModerationAssignments"
      @toggle="toggleIsPreview"
      @save="saveTask(false)"
      @saveAndBackToList="saveTask(true)"
      @onAccept="acceptApplications"
      @onSendForModeration="sendForModeration"
      @onSeeComments="showComments"
    />
    <SelectTaskBlock @onLoadTask="val => loadTask(val)" />
    <TaskContent />
    <TaskFooter
      :disabled="!$canSave"
      @save="saveTask(false)"
      @saveAndBackToList="saveTask(true)"
    />
    <ModeratorSelectModal type="test" />
    <SendForModerationModal />
    <OutgoingModal />
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
  loadApplication,
} from '@/pages/bank/test-tasks/edit/task-edition-page.model'
import { $token } from '@/features/api/common/request'
import {
  loadModalToSendForCheck,
  $canRefreshAfterSendingForModeration,
} from '@/pages/bank/common/modals/moderator-select/moderator-select.model'
import { $status } from '@/pages/common/parts/status-controller/status.model'
import { navigateReplace } from '@/features/navigation'
import { acceptApplicationsFx } from '@/pages/applications/incoming/incoming-applications-page.model'
import { loadModal } from '@/pages/applications/modals/send-for-moderation/send-for-moderation.model'
import SendForModerationModal from '@/pages/applications/modals/send-for-moderation/SendForModerationModal.vue'
import { loadCommentModal } from '@/pages/applications/modals/outgoing-comment/outgoing-comment.model'
import OutgoingModal from '@/pages/applications/modals/outgoing-comment/OutgoingComment.vue'

export default Vue.extend({
  name: 'TaskEditionPage',
  components: {
    TaskHeader,
    TaskContent,
    TaskFooter,
    SelectTaskBlock,
    ModeratorSelectModal,
    SendForModerationModal,
    OutgoingModal,
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
    fromPage: '',
    applications: [] as number[],
  }),
  watch: {
    $isPreview: {
      handler(newVal) {
        if (newVal) {
          navigateReplace({
            name: 'preview-task',
            query: {
              questions: this.questions.length ? this.questions.join(',') : `${this.$taskId}`,
              taskType: 'test-assignment',
              token: this.$token,
              fromPage: this.fromPage,
              applications: this.applications.join(','),
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
    acceptApplications() {
      acceptApplicationsFx({ tickets: [this.applications[0]] })
    },
    sendForModeration() {
      loadModal([this.applications[0]])
    },
    showComments() {
      loadCommentModal(this.$taskId)
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
    const { applications, fromPage } = this.$route.query
    if (applications && typeof applications === 'string') {
      this.applications = applications.split(',').map((appId) => Number(appId))
      loadApplication(this.applications[0])
    }
    if (fromPage && typeof fromPage === 'string') {
      this.fromPage = fromPage
    }
    /* todo: https://trello.com/c/xtZZirJi */
    loadTask(+this.$route.params.id)
  },
})
</script>

