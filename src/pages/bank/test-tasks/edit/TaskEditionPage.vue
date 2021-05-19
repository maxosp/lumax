<template>
  <div class="test-task-creation">
    <TaskHeader
      title="Редактирование тестового задания"
      :disabled="!$canSave"
      :is-preview="$isPreview"
      :from-page="fromPage"
      task-type="test-assignment"
      status-controller
      @toggle="toggleIsPreview"
      @save="saveTask(false)"
      @saveAndBackToList="saveTask(true)"
      @onAccept="acceptApplications"
      @onSendToReview="sendToReview"
      @onSendToRevision="sendToRevision"
      @onSeeComments="showComments"
    />
    <SelectTask
      :questions="questions"
    />
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
  $canRefreshAfterSendingToReview,
} from '@/pages/bank/common/modals/moderator-select/moderator-select.model'
import { $status } from '@/pages/common/parts/status-controller/status.model'
import { navigateReplace } from '@/features/navigation'
import { acceptApplicationsFx } from '@/pages/applications/incoming/incoming-applications-page.model'
import {
  $canRefreshAfterSendingToRevision,
  loadModal,
} from '@/pages/applications/modals/send-for-moderation/send-for-moderation.model'
import SendForModerationModal from '@/pages/applications/modals/send-for-moderation/SendForModerationModal.vue'
import { loadCommentModal } from '@/pages/applications/modals/outgoing-comment/outgoing-comment.model'
import OutgoingModal from '@/pages/applications/modals/outgoing-comment/OutgoingComment.vue'
import SelectTask from '@/pages/preview-tasks/parts/select-task/SelectTask.vue'
import {
  $currentIndex,
  $currentQuestion,
} from '@/pages/preview-tasks/parts/select-task/select-task.model'
import { combineRouteQueries } from '@/features/lib'
import { resetCounters } from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/form/moving-images-on-image-answer-form.model'

export default Vue.extend({
  name: 'TaskEditionPage',
  components: {
    TaskHeader,
    TaskContent,
    TaskFooter,
    SelectTask,
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
    $canRefreshAfterSendingToReview,
    $canRefreshAfterSendingToRevision,
    $currentIndex,
    $currentQuestion,
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
              currentQuestion: String(this.$currentQuestion),
            },
          })
        }
      },
    },
    $currentIndex(value) {
      if (value !== $currentIndex) {
        this.refreshPage()
      }
    },
    $currentQuestion(value) {
      if (value !== $currentQuestion) {
        this.$router.replace(combineRouteQueries(this.$route.query, { currentQuestion: value }))
      }
    },
    $canRefreshAfterSendingToReview(value) {
      if (value) {
        this.refreshPage()
      }
    },
    $canRefreshAfterSendingToRevision(value) {
      if (value) {
        this.refreshPage()
      }
    },
  },
  methods: {
    loadTask,
    toggleIsPreview,
    sendToReview() {
      loadModalToSendForCheck([this.$taskId])
    },
    saveTask(isRedirect: boolean) {
      save()
      if (isRedirect) {
        setRedirectAfterSave(true)
      }
    },
    async acceptApplications() {
      await acceptApplicationsFx({ tickets: [this.applications[this.$currentIndex]] })
      this.refreshPage()
    },
    sendToRevision() {
      loadModal([this.applications[this.$currentIndex]])
    },
    refreshPage() {
      loadTask(+this.questions[this.$currentIndex])
      if (this.applications.length) loadApplication(this.applications[this.$currentIndex])
    },
    showComments() {
      loadCommentModal(this.$taskId)
    },
  },
  beforeDestroy() {
    clearFields()
    toggleIsPreview(false)
    resetCounters()
  },
  created() {
    const { questions, applications, fromPage, currentQuestion } = this.$route.query

    if (questions && typeof questions === 'string') {
      this.questions = questions.split(',')
    }
    if (applications && typeof applications === 'string') {
      this.applications = applications.split(',').map((appId) => Number(appId))
      loadApplication(this.applications[this.$currentIndex])
    }
    if (fromPage && typeof fromPage === 'string') {
      this.fromPage = fromPage
    }
    if (currentQuestion && typeof +currentQuestion === 'number') {
      loadTask(+this.questions[this.$currentIndex])
    } else {
      loadTask(+this.$route.params.id)
    }
  },
})
</script>

