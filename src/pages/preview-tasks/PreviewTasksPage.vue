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
    <Card v-if="questions.length > 1" class="toggler-tasks">
      <TasksDropdown @setItem="val => onSelectTask(val)" />
      <div class="counter-tasks">
        <span>{{ currentIndex + 1 }}</span>
        <span>/</span>
        <span>{{ questions.length }}</span>
      </div>
      <div class="btn" @click="prevTask">
        <Icon
          type="arrow-left"
          size="16"
        />
      </div>
      <div class="btn" @click="nextTask">
        <Icon
          type="arrow-right"
          size="16"
        />
      </div>
    </Card>
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
import TasksDropdown from '@/pages/preview-tasks/tasks-dropdown/TasksDropdown.vue'
import Card from '@/ui/card/Card.vue'
import Icon from '@/ui/icon/Icon.vue'
import { config } from '@/config'
import {
  initDropDown,
  taskIndexChanged,
} from '@/pages/preview-tasks/tasks-dropdown/tasks-dropdown.model'
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

type IframeData = {
  activeTask: string | null
  token: string | null
  taskType: string | null
}
export default Vue.extend({
  name: 'PreviewTasksPage',
  components: {
    Controller,
    Card,
    Icon,
    TasksDropdown,
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
    currentIndex: null as null | number,
    fromPage: '',
  }),
  effector: {
    $isPreview,
    $canRefreshAfterSendingForModeration,
  },
  computed: {
    activeTask() {
      return this.questions.length && typeof this.currentIndex === 'number'
        ? this.questions[this.currentIndex]
        : null
    },
    activeApplication() {
      return this.applications.length && typeof this.currentIndex === 'number'
        ? this.applications[this.currentIndex]
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
              },
              params: { id: this.activeTask || '1' },
            })
            break
          case 'olympiad-assignment':
            navigateReplace({
              name: 'olympiad-tasks-edit',
              query: {
                fromPage: this.fromPage,
              },
              params: { id: this.activeTask || '1' },
            })
            break
          case 'lesson-assignment':
            navigateReplace({
              name: 'lesson-tasks-edit',
              query: {
                fromPage: this.fromPage,
              },
              params: { id: this.activeTask || '1' },
            })
            break
          default:
            navigateReplace({
              name: 'test-tasks-edit',
              query: {
                fromPage: this.fromPage,
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
  },
  methods: {
    toEditPage() {
      let nameRoute = 'test-tasks-edit'
      if (this.taskType === 'olympiad-assignment') nameRoute = 'olympiad-tasks-edit'
      if (this.taskType === 'lesson-tasks-edit') nameRoute = 'lesson-tasks-edit'
      this.$router.push({ name: nameRoute, params: { id: `${this.activeTask}` } })
    },
    nextTask() {
      if (typeof this.currentIndex === 'number') {
        if (this.currentIndex === this.questions.length - 1) this.currentIndex = 0
        else this.currentIndex += 1
        taskIndexChanged(this.currentIndex)
      }
    },
    prevTask() {
      if (typeof this.currentIndex === 'number') {
        if (this.currentIndex === 0) this.currentIndex = this.questions.length - 1
        else this.currentIndex -= 1
        taskIndexChanged(this.currentIndex)
      }
    },
    onSelectTask(val: string) {
      const index = this.questions.findIndex((item) => item === val)
      if (index !== -1) this.currentIndex = index
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
      this.currentIndex = 0
      if (questions.length > 1) initDropDown()
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
  margin-top: 20px;
  user-select: none;
}
.toggler-tasks {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0;
  margin-top: 20px;
  background-color: rgba(0, 0, 0, 0);
}
.toggler-tasks /deep/ .content {
  flex-direction: row;
}
.toggler-tasks /deep/ .wrap {
  width: 100%;
}
.toggler-tasks /deep/ .icon-wrap,
.toggler-tasks /deep/ .inner-input {
  height: 40px;
}
.toggler-tasks /deep/ .label {
  margin-bottom: 0;
}
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #fff;
  border-radius: 7px;
  margin-left: 10px;
  cursor: pointer;
}
.counter-tasks {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  margin-left: 15px;
}
</style>
