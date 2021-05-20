<template>
  <div class="test-task-creation">
    <TaskHeader
      title="Редактирование олимпиадного задания"
      :disabled="!$canSave"
      :is-preview="$isPreview"
      :can-toggle-preview="canTogglePreview"
      :from-page="fromPage"
      class="header"
      status-controller
      @toggle="toggleIsPreview"
      @save="saveTask(false)"
      @saveAndBackToList="saveTask(true)"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TaskHeader from '@/pages/bank/common/parts/Header.vue'
import TaskContent from '@/pages/bank/olympiad-tasks/edit/parts/Content.vue'
import TaskFooter from '@/pages/bank/common/parts/Footer.vue'
import {
  save,
  $canSave,
  clearFields,
  loadTask,
  setRedirectAfterSave,
  $isPreview,
  toggleIsPreview,
  $taskId,
} from '@/pages/bank/olympiad-tasks/edit/task-edition-page.model'
import { $token } from '@/features/api/common/request'
import { navigateReplace } from '@/features/navigation'
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
  },
  effector: {
    $canSave,
    $isPreview,
    $taskId,
    $token,
    $currentIndex,
    $currentQuestion,
  },
  data() {
    return {
      questions: [] as string[],
      fromPage: '',
    }
  },
  computed: {
    canTogglePreview(): boolean {
      return !!this.questions.length || !!this.$taskId
    },
  },
  watch: {
    $isPreview: {
      handler(newVal) {
        if (newVal) {
          navigateReplace({
            name: 'preview-task',
            query: {
              questions: this.questions.length ? this.questions.join(',') : `${this.$taskId}`,
              taskType: 'olympiad-assignment',
              token: this.$token,
              fromPage: this.fromPage,
              currentQuestion: String(this.$currentQuestion),
            },
          })
        }
      },
    },
    $currentIndex: {
      handler(newVal) {
        loadTask(+this.questions[newVal])
      },
    },
    $currentQuestion(value) {
      if (value !== $currentQuestion) {
        this.$router.replace(combineRouteQueries(this.$route.query, { currentQuestion: value }))
      }
    },
  },
  methods: {
    toggleIsPreview,
    saveTask(isRedirect: boolean) {
      save()
      if (isRedirect) setRedirectAfterSave(true)
    },
  },
  created() {
    const { questions, fromPage, currentQuestion } = this.$route.query

    if (questions && typeof questions === 'string') {
      this.questions = questions.split(',')
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
  beforeDestroy() {
    clearFields()
    resetCounters()
  },
})
</script>

<style scoped>
.header ::v-deep .bottom .buttons {
  display: none;
}
</style>
