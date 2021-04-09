<template>
  <Card v-if="questions.length > 1" class="toggler-tasks">
    <TasksDropdown @setItem="val => changeIndexTask(val)" />
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
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '@/ui/card/Card.vue'
import TasksDropdown from '@/pages/preview-tasks/tasks-dropdown/TasksDropdown.vue'
import Icon from '@/ui/icon/Icon.vue'
import { initDropDown } from '@/pages/preview-tasks/tasks-dropdown/tasks-dropdown.model'
import { goBack } from '@/features/navigation'

export default Vue.extend({
  name: 'SelecteTaskBlock',
  components: {
    Card,
    TasksDropdown,
    Icon,
  },
  data: () => ({
    questions: [] as string[],
    currentIndex: null as null | number,
  }),
  methods: {
    changeIndexTask(val: string) {
      const index = this.questions.findIndex((item) => item === val)
      if (index !== -1) this.currentIndex = index
    },
    nextTask() {
      if (typeof this.currentIndex === 'number') {
        if (this.currentIndex === this.questions.length - 1) this.currentIndex = 0
        else this.currentIndex += 1
        this.$emit('onLoadTask', this.questions[this.currentIndex])
      }
    },
    prevTask() {
      if (typeof this.currentIndex === 'number') {
        if (this.currentIndex === 0) this.currentIndex = this.questions.length - 1
        else this.currentIndex -= 1
        this.$emit('onLoadTask', this.questions[this.currentIndex])
      }
    },
  },
  created() {
    const { questions } = this.$route.query
    if (questions && typeof questions === 'string') {
      this.questions = questions.split(',')
      this.currentIndex = 0
      if (questions.length > 1) initDropDown()
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
  margin: 20px 0;
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
