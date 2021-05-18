<template>
  <Card v-if="questions.length > 1" class="toggler-tasks">
    <TasksDropdown @setItem="val => onSelectTask(val)" />
    <div class="counter-tasks">
      <span>{{ $currentQuestion }}</span>
      <span>/</span>
      <span>{{ $questionAmount }}</span>
    </div>
    <div class="btn" @click="prev($route)">
      <Icon
        type="arrow-left"
        size="16"
      />
    </div>
    <div class="btn" @click="next($route)">
      <Icon
        type="arrow-right"
        size="16"
      />
    </div>
  </Card>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '@/ui/card/Card.vue'
import TasksDropdown from '@/pages/preview-tasks/parts/tasks-dropdown/TasksDropdown.vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  $currentQuestion,
  $questionAmount,
  setCurrentIndex,
  prev,
  next,
  setQuestionsAmount,
  setCurrentQuestion,
} from '@/pages/preview-tasks/parts/select-task/select-task.model'
import { goBack, Navigate } from '@/features/navigation'
import {
  loadCurrentLabelsIDs,
  resetLabels,
} from '@/pages/bank/test-tasks/edit/parts/labels-dropdown/labels-dropdown.model'

export default Vue.extend({
  name: 'SelectTask',
  components: {
    Card,
    TasksDropdown,
    Icon,
  },
  data() {
    return {
      questions: [] as string[],
    }
  },
  effector: {
    $currentQuestion,
    $questionAmount,
  },
  methods: {
    prev,
    next,
    onSelectTask(val: string) {
      const index = this.questions.findIndex((item) => item === val)
      const tasksIds = (this.$route as Navigate).query!.questions.split(',')
      if (index !== -1) {
        resetLabels()
        loadCurrentLabelsIDs(+tasksIds[index])
        setCurrentIndex(index)
      }
    },
  },
  created() {
    const { questions, currentQuestion } = this.$route.query

    if (questions && typeof questions === 'string') {
      this.questions = questions.split(',')

      if (this.questions.length > 1) {
        setQuestionsAmount(this.questions.length)
      }
    }

    if (
      currentQuestion &&
      typeof currentQuestion === 'string' &&
      typeof +currentQuestion === 'number'
    ) {
      setCurrentQuestion(+currentQuestion)
    } else {
      setCurrentQuestion(1)
    }
    if (!this.questions) goBack()
  },
})
</script>

<style scoped>
.toggler-tasks {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0;
  margin-bottom: 20px;
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
.counter-tasks {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  margin-left: 15px;
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
</style>
