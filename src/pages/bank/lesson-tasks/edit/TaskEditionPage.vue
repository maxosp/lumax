<template>
  <div class="test-task-creation">
    <TaskHeader
      title="Редактирование урочного задания"
      :disabled="!$canSave"
      :is-preview="$isPreview"
      :from-page="fromPage"
      class="header"
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
import TaskContent from '@/pages/bank/lesson-tasks/edit/parts/Content.vue'
import TaskFooter from '@/pages/bank/common/parts/Footer.vue'
import {
  save,
  $canSave,
  clearFields,
  loadTask,
  $taskId,
  setRedirectAfterSave,
  $isPreview,
  toggleIsPreview,
} from '@/pages/bank/lesson-tasks/edit/task-edition-page.model'
import { $token } from '@/features/api/common/request'
import { navigateReplace } from '@/features/navigation'
import SelectTask from '@/pages/preview-tasks/parts/select-task/SelectTask.vue'
import {
  $currentIndex,
  $currentQuestion,
} from '@/pages/preview-tasks/parts/select-task/select-task.model'
import { combineRouteQueries } from '@/features/lib'

export default Vue.extend({
  name: 'TaskCreationPage',
  components: {
    TaskHeader,
    TaskContent,
    TaskFooter,
    SelectTask,
  },
  effector: {
    $canSave,
    $taskId,
    $token,
    $isPreview,
    $currentIndex,
    $currentQuestion,
  },
  data() {
    return {
      questions: [] as string[],
      fromPage: '',
    }
  },
  watch: {
    $isPreview: {
      handler(newVal) {
        if (newVal) {
          navigateReplace({
            name: 'preview-task',
            query: {
              questions: this.questions.length ? this.questions.join(',') : `${this.$taskId}`,
              taskType: 'lesson-assignment',
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
    loadTask(+this.$route.params.id)
    if (currentQuestion && typeof +currentQuestion === 'number') {
      loadTask(+this.questions[this.$currentIndex])
    } else {
      loadTask(+this.$route.params.id)
    }
  },
  beforeDestroy() {
    clearFields()
  },
})
</script>

<style scoped>
.header ::v-deep .bottom .buttons {
  display: none;
}
</style>


