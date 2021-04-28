<template>
  <div class="preview-tasks-page">
    <Controller
      :from-page="fromPage"
      :task-type="taskType"
      @onAccept="acceptApplications"
      @onSendForModeration="sendForModeration"
      @onSeeComments="showComments"
      @toEditPage="toEditPage"
      @onReview="sendToModeration"
    />
    <SelectTask
      :questions="questions"
    />
    <Card class="previw-task">
      <iframe
        ref="iframe"
        :src="iframeLink"
        seamless
        width="100%"
      />
    </Card>
    <ModeratorSelectModal type="test" />
    <SendForModerationModal />
    <OutgoingModal />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Controller from '@/pages/preview-tasks/Controller.vue'
import Card from '@/ui/card/Card.vue'
import { config } from '@/config'
import { $isPreview, toggleIsPreview } from '@/pages/preview-tasks/controller.model'
import { acceptApplicationsFx } from '@/pages/applications/incoming/incoming-applications-page.model'
import { loadModal } from '@/pages/applications/modals/send-for-moderation/send-for-moderation.model'
import SendForModerationModal from '@/pages/applications/modals/send-for-moderation/SendForModerationModal.vue'
import { loadCommentModal } from '@/pages/applications/modals/outgoing-comment/outgoing-comment.model'
import OutgoingModal from '@/pages/applications/modals/outgoing-comment/OutgoingComment.vue'
import {
  loadTestTask,
  loadOlympiadTask,
  loadLessonTask,
  loadApplication,
} from '@/pages/preview-tasks/preview-tasks-page.model'
import { goBack, navigateReplace } from '@/features/navigation/index'
import {
  loadModalToSendForCheck,
  $canRefreshAfterSendingForModeration,
} from '@/pages/bank/common/modals/moderator-select/moderator-select.model'
import ModeratorSelectModal from '@/pages/bank/common/modals/moderator-select/ModeratorSelectModal.vue'
import SelectTask from '@/pages/preview-tasks/parts/select-task/SelectTask.vue'
import {
  $currentIndex,
  $currentQuestion,
} from '@/pages/preview-tasks/parts/select-task/select-task.model'
import { combineRouteQueries } from '@/features/lib'

type IframeData = {
  activeTask: string | null
  token: string | null
  taskType: string | null
}

export default Vue.extend({
  name: 'PreviewTasksPage',
  components: {
    SelectTask,
    Controller,
    Card,
    SendForModerationModal,
    OutgoingModal,
    ModeratorSelectModal,
  },
  data: () => ({
    questions: [] as string[],
    token: null as null | string,
    taskType: null as null | string,
    applications: [] as number[],
    heightIframe: 0,
    fromPage: '',
  }),
  effector: {
    $isPreview,
    $canRefreshAfterSendingForModeration,
    $currentIndex,
    $currentQuestion,
  },
  computed: {
    activeTask() {
      return this.questions.length && typeof this.$currentIndex === 'number'
        ? this.questions[this.$currentIndex]
        : null
    },
    activeApplication() {
      return this.applications.length && typeof this.$currentIndex === 'number'
        ? this.applications[this.$currentIndex]
        : null
    },
    iframeLink() {
      const { activeTask, token, taskType }: IframeData = this
      return activeTask && token && taskType
        ? `${config.PREVIEW_URL}/question?questionId=${activeTask}&type=${taskType}&token=${token}`
        : ''
    },
  },
  watch: {
    $isPreview(value) {
      if (!value) {
        switch (this.taskType) {
          case 'test-assignment':
            navigateReplace({
              name: 'test-tasks-edit',
              query: {
                questions: this.questions.join(','),
                fromPage: this.fromPage,
                applications: this.applications.join(','),
                currentQuestion: String(this.$currentQuestion),
              },
              params: { id: this.activeTask || '1' },
            })
            break
          case 'olympiad-assignment':
            navigateReplace({
              name: 'olympiad-tasks-edit',
              query: {
                questions: this.questions.join(','),
                fromPage: this.fromPage,
                currentQuestion: String(this.$currentQuestion),
              },
              params: { id: this.activeTask || '1' },
            })
            break
          case 'lesson-assignment':
            navigateReplace({
              name: 'lesson-tasks-edit',
              query: {
                questions: this.questions.join(','),
                fromPage: this.fromPage,
                currentQuestion: String(this.$currentQuestion),
              },
              params: { id: this.activeTask || '1' },
            })
            break
          default:
            navigateReplace({
              name: 'test-tasks-edit',
              query: {
                fromPage: this.fromPage,
                currentQuestion: String(this.$currentQuestion),
              },
              params: { id: this.activeTask || '1' },
            })
        }
      } else {
        goBack()
      }
    },
    activeTask(value) {
      if (this.taskType) {
        switch (this.taskType) {
          case 'test-assignment':
            loadTestTask(value)
            break
          case 'olympiad-assignment':
            loadOlympiadTask(value)
            break
          case 'lesson-assignment':
            loadLessonTask(value)
            break
          default:
            loadLessonTask(value)
        }
      }
    },
    activeApplication(value) {
      loadApplication(value)
    },
    $canRefreshAfterSendingForModeration(value) {
      if (value) this.$router.go(0)
    },
    $currentQuestion(value) {
      if (value !== $currentQuestion) {
        this.$router.replace(combineRouteQueries(this.$route.query, { currentQuestion: value }))
      }
    },
  },
  methods: {
    toEditPage() {
      let nameRoute = 'test-tasks-edit'
      if (this.taskType === 'olympiad-assignment') nameRoute = 'olympiad-tasks-edit'
      if (this.taskType === 'lesson-tasks-edit') nameRoute = 'lesson-tasks-edit'
      this.$router.push({ name: nameRoute, params: { id: `${this.activeTask}` } })
    },
    acceptApplications() {
      if (this.activeApplication) acceptApplicationsFx({ tickets: [this.activeApplication] })
    },
    sendForModeration() {
      if (this.activeApplication) loadModal([this.activeApplication])
    },
    showComments() {
      if (this.activeTask) loadCommentModal(parseInt(`${this.activeApplication}`, 10))
    },
    sendToModeration() {
      if (this.activeTask) loadModalToSendForCheck([parseInt(this.activeTask, 10)])
    },
  },
  created() {
    const { questions, token, taskType, applications, fromPage } = this.$route.query
    if (questions && typeof questions === 'string') {
      this.questions = questions.split(',')
    }
    if (token && typeof token === 'string') this.token = token
    if (taskType && typeof taskType === 'string') this.taskType = taskType
    if (applications && typeof applications === 'string') {
      this.applications = applications.split(',').map((appId) => Number(appId))
    }
    if (fromPage && typeof fromPage === 'string') {
      this.fromPage = fromPage
    }
    if (!this.questions || !this.token || !this.taskType || !this.fromPage) goBack()
  },
  mounted() {
    // костыль для получения высоты контента внутри iframe
    window.addEventListener('message', (event) => {
      if (event.data.height && this.heightIframe !== event.data.height) {
        this.heightIframe = event.data.height
        const el = this.$refs.iframe as HTMLElement
        if (el) el.style.height = `${event.data.height}px`
      }
    })
  },
  beforeDestroy() {
    // changeTasks([])
    toggleIsPreview(true)
  },
})
</script>

<style scoped>
.previw-task {
  padding: 0;
  user-select: none;
}
</style>
