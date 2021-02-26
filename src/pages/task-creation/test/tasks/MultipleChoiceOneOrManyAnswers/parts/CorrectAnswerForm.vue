<template>
  <div class="question-answers-form">
    <div class="left-border" />
    <BaseSwitch
      class="switch toggler"
      :checked="$marksEnabled"
      @change="toggleMarksEnabling"
    >
      <p>Указать количество баллов за каждый верный ответ</p>
    </BaseSwitch>
    <div
      v-for="(qa, idx) in $questionsAnswers"
      :key="qa.id"
      class="question-answers"
    >
      <FormInput
        :label="idx === 0 ? 'Вопрос' : ''"
        :value="qa.question"
        placeholder="Введите вопрос"
        class="question-input"
        @input="(question) => handleQuestionChange({ id: qa.id, question })"
      />
      <div class="correct-checkbox">
        <div v-if="idx === 0" class="checkbox-label">Правильный ответ</div>
        <BaseCheckbox
          :value="qa.isCorrect"
          :class="{ checkbox: true, 'first-checkbox': idx === 0 }"
          @change="handleIsCorrectChange({ id: qa.id })"
        />
      </div> 
      <FormInput
        v-if="$marksEnabled"
        :label="idx === 0 ? 'Баллы' : ''"
        :value="qa.mark"
        placeholder="Баллов"
        class="answer-mark"
        @input="(mark) => handleMarkChange({ questionId: qa.id, mark })"
      />
      <div
        v-if="$questionsAnswers.length > 1"
        :class="{ transparent: true, 'icon-btn': true, 'first-icon': idx === 0 }"
        @click="removeQuestion({ questionId: qa.id })"
      >
        <Icon
          class="icon-close"
          type="close"
          size="8"
        />
      </div>
    </div>
    <div class="add-question" @click="addQuestion">
      <BaseButton>Добавить вариант ответа</BaseButton>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import FormInput from '@/ui/input/FormInput.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseCheckbox from '@/ui/checkbox/BaseCheckbox.vue'
import {
  $questionsAnswers,
  setQuestionsAnswers,
} from '@/pages/task-creation/test/tasks/MultipleChoiceOneOrManyAnswers/multiple-choice-one-or-many-answers.model'
import { getRandomId } from '@/pages/task-creation/test/tasks/utils'

export default Vue.extend({
  name: 'CorrectAnswerForm',
  components: {
    Icon,
    FormInput,
    BaseSwitch,
    BaseButton,
    BaseCheckbox,
  },
  effector: {
    $questionsAnswers,
  },
  methods: {
    handleQuestionChange({ id, question }) {
      const questionsAnswers = this.$questionsAnswers.map((qa) =>
        qa.id === id ? { ...qa, question } : qa
      )
      setQuestionsAnswers(questionsAnswers)
    },
    handleIsCorrectChange({ questionId }) {
      const questionsAnswers = this.$questionsAnswers.map((qa) =>
        qa.id === questionId ? { ...qa, isCorrect: !qa.isCorrect } : qa
      )
      setQuestionsAnswers(questionsAnswers)
    },
    handleMarkChange({ questionId, mark }) {
      const questionsAnswers = this.$questionsAnswers.map((qa) =>
        qa.id === questionId ? { ...qa, mark } : qa
      )
      setQuestionsAnswers(questionsAnswers)
    },
    removeQuestion({ questionId }) {
      const questionsAnswers = this.$questionsAnswers.filter((qa) => qa.id !== questionId)
      setQuestionsAnswers(questionsAnswers)
    },
    addQuestion() {
      setQuestionsAnswers([
        ...this.$questionsAnswers,
        { id: getRandomId(), question: '', answer: '', mark: '', isCorrect: false },
      ])
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

.question-answers {
  display: flex;

  & + .question-answers {
    margin-top: 10px;
  }
}

.correct-checkbox {
  max-width: 40px;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}

.checkbox-label {
  position: absolute;
  width: 132px;
  color: #000;
  font-weight: 600;
  line-height: 17px;
  transform: translate(-83%, 0);
}

.first-checkbox {
  margin-top: 30px !important;
}

.checkbox {
  margin-top: 16px;
}

.toggler {
  margin-top: 0px;
  margin-bottom: 20px;
}

.question-input {
  flex-grow: 1;
}

.answer-mark {
  max-width: 150px;
  margin-left: 10px;
}

.icon-btn {
  margin-top: 5px;
  max-width: 150px;
  margin-left: 10px;
  cursor: pointer;
  width: 46px;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-color: var(--base-text-primary);
}

.first-icon {
  margin-top: 19px;
}

.transparent {
  background-color: transparent;
}

.icon-plus {
  fill: #fff;
}
.icon-close {
  fill: var(--c-grey-3);
}

.add-question {
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px solid var(--c-grey-11);
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>