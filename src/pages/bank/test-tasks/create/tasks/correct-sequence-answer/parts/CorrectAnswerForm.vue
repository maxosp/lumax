<template>
  <div class="question-answers-form">
    <div class="left-border" />
    <BaseCheckbox
      option="reorder"
      class="reorder-checkbox"
      :value="$reorderEnabled"
      @change="toggleReorderEnabling"
    >
      Отключить перемешивание
    </BaseCheckbox>
    <div class="annotation">
      Введите элементы в правильной последовательности
    </div>
    <Draggable
      v-model="$questions"
      group="questions"
      handle=".handle"
      @start="drag = true"
      @end="drag = false"
    >
      <div
        v-for="(question, idx) in $questions"
        :key="question.id"
        class="question"
      >
        <div class="order">{{ idx + 1 }}.</div>
        <Wysiwyg :value="question.question" @input="question => handleQuestionChange({ id: question.id, question })" />
        <div class="handle">
          <Icon
            type="burger"
            class="icon-handle"
            size="14"
          />
        </div>
        <div
          v-if="$questions.length > 1"
          class="transparent icon-btn"
          @click="removeQuestion({ id: question.id })"
        >
          <Icon
            class="icon-close"
            type="close"
            size="8"
          />
        </div>
      </div>
    </Draggable>
    <div class="add-question" @click="addQuestion">
      <BaseButton>Добавить вариант</BaseButton>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Draggable from 'vuedraggable'
import Icon from '@/ui/icon/Icon.vue'
import BaseCheckbox from '@/ui/checkbox/BaseCheckbox.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $questions,
  setQuestions,
  $reorderEnabled,
  toggleReorderEnabling,
} from '@/pages/bank/test-tasks/create/tasks/correct-sequence-answer/correct-sequence-answer.model'
import { getRandomId } from '@/pages/bank/test-tasks/create/tasks/utils'

export default Vue.extend({
  name: 'CorrectAnswerForm',
  components: {
    Draggable,
    Icon,
    BaseCheckbox,
    Wysiwyg,
    BaseButton,
  },
  effector: {
    $reorderEnabled,
    $questions,
  },
  methods: {
    toggleReorderEnabling,
    handleQuestionChange({ id, question }) {
      const questions = this.$questions.map((qst) => (qst.id === id ? { ...qst, question } : qst))
      setQuestions(questions)
    },
    addQuestion() {
      setQuestions([
        ...this.$questions,
        { id: getRandomId(), question: '', order: this.$questions.length },
      ])
    },
    removeQuestion({ id }) {
      const questions = this.$questions.filter((question) => question.id !== id)
      setQuestions(questions)
    },
  },
})
</script>

<style scoped>
.question-answers-form {
  position: relative;
  display: flex;
  flex-direction: column;
}

.left-border {
  position: absolute;
  left: -30px;
  width: 4px;
  height: 100%;
  background-color: var(--c-yellow-1);
}

.order,
.annotation {
  color: var(--base-text-primary);
}

.order {
  font-weight: 600;
  line-height: 17px;
  margin-right: 10px;
}

.reorder-checkbox,
.annotation {
  margin-bottom: 20px;
}

.question {
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-bottom: 10px;
}

.handle,
.icon-btn {
  margin-left: 10px;
}

.icon-btn {
  cursor: pointer;
  width: 46px;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-color: var(--base-text-primary);
}

.transparent {
  background-color: transparent;
}

.sortable-chosen .handle {
  cursor: grabbing;
}

.handle {
  cursor: grab;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 36px;
  height: 36px;
  border-radius: 7px;
  background-color: var(--c-grey-4);
}

.icon-plus {
  fill: #fff;
}

.icon-close {
  fill: var(--c-grey-3);
}

.icon-handle {
  fill: var(--base-text-secondary);
}

.add-question {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
