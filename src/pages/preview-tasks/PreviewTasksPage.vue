<template>
  <div class="preview-tasks-page">
    <Controller
      :is-tasks="!isApplications"
      :is-test-tasks="type && type === 'test-assignment'"
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
} from '@/pages/preview-tasks/preview-tasks-page.model'
import { goBack, navigatePush } from '@/features/navigation/index'
import {
  loadModalToSendForCheck,
  $canRefreshAfterSendingForModeration,
} from '@/pages/bank/common/modals/moderator-select/moderator-select.model'
import ModeratorSelectModal from '@/pages/bank/common/modals/moderator-select/ModeratorSelectModal.vue'

type IframeData = {
  activeTask: string | null
  token: string | null
  type: string | null
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
    type: null as null | string,
    applications: [] as number[],
    heightIframe: 0,
    currentIndex: null as null | number,
    isApplications: false,
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
      const { activeTask, token, type }: IframeData = this
      return activeTask && token && type
        ? `${config.PREVIEW_URL}/question?questionId=${activeTask}&type=${type}&token=${token}`
        : ''
    },
  },
  watch: {
    $isPreview(value) {
      if (!value) {
        switch (this.type) {
          case 'test-assignment':
            navigatePush({
              name: 'test-tasks-edit',
              params: { id: this.activeTask || '1' },
              query: { questions: this.questions.join(', ') },
            })
            break
          case 'olympiad-assignment':
            navigatePush({ name: 'olympiad-tasks-edit', params: { id: this.activeTask || '1' } })
            break
          case 'lesson-assignment':
            navigatePush({ name: 'lesson-tasks-edit', params: { id: this.activeTask || '1' } })
            break
          default:
            navigatePush({ name: 'test-tasks-edit', params: { id: this.activeTask || '1' } })
        }
      } else {
        goBack()
      }
    },
    activeTask(value) {
      if (this.type) {
        switch (this.type) {
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
    $canRefreshAfterSendingForModeration(value) {
      if (value) this.$router.go(0)
    },
  },
  methods: {
    toEditPage() {
      let nameRoute = 'test-tasks-edit'
      if (this.type === 'olympiad-assignment') nameRoute = 'olympiad-tasks-edit'
      if (this.type === 'lesson-tasks-edit') nameRoute = 'lesson-tasks-edit'
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
    const { questions, token, type, application, applications } = this.$route.query
    if (questions && typeof questions === 'string') {
      this.questions = questions.split(',')
      this.currentIndex = 0
      if (questions.length > 1) initDropDown()
    }
    if (token && typeof token === 'string') this.token = token
    if (type && typeof type === 'string') this.type = type
    if (application && typeof application === 'string' && application === 'true') {
      this.isApplications = true
    }
    if (applications && typeof applications === 'string') {
      this.applications = applications.split(',').map((appId) => Number(appId))
    }
    if (!this.questions || !this.token || !this.type || !this.applications) goBack()
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
