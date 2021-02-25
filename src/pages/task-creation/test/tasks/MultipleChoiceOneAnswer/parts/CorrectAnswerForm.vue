<template>
  <div class="question-answers-form">
    <div class="left-border" />
    <BaseSwitch
      class="switch toggler"
      :checked="$makrsEnabled"
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
      <div class="correct-radio">
        <div v-if="idx === 0" class="radio-label">Правильный ответ</div>
        <RadioButton
          option="is-correct"
          :class="{ 'radio-button': true, 'first-radio': idx === 0 }"
          :value="qa.isCorrect ? 'is-correct' : 'non-correct'"
          @change="handleIsCorrectChange({ questionId: qa.id })"
        />
      </div> 
      <FormInput
        v-if="$makrsEnabled"
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
      <BaseButton>Добавить вариант&nbsp;ответа</BaseButton>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import FormInput from '@/ui/input/FormInput.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import RadioButton from '@/ui/radio/RadioButton.vue'
import {
  $makrsEnabled,
  toggleMarksEnabling,
  $questionsAnswers,
  setQuestionsAnswers,
} from '@/pages/task-creation/test/tasks/MultipleChoiceOneAnswer/multiple-choice-one-answer.model'
import { getRandomId } from '@/pages/task-creation/test/tasks/utils'

export default Vue.extend({
  name: 'CorrectAnswerForm',
  components: {
    Icon,
    FormInput,
    BaseSwitch,
    BaseButton,
    RadioButton,
  },
  effector: {
    $makrsEnabled,
    $questionsAnswers,
  },
  methods: {
    toggleMarksEnabling,
    handleQuestionChange({ id, question }) {
      const questionsAnswers = this.$questionsAnswers.map((qa) =>
        qa.id === id ? { ...qa, question } : qa
      )
      setQuestionsAnswers(questionsAnswers)
    },
    handleIsCorrectChange({ questionId }) {
      const questionsAnswers = this.$questionsAnswers.map((qa) => {
        if (qa.id === questionId) {
          if (qa.isCorrect) {
            return qa
          }
          return { ...qa, isCorrect: true }
        }
        return { ...qa, isCorrect: false }
      })
      console.log(questionsAnswers)
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

.correct-radio {
  max-width: 40px;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}

.radio-label {
  position: absolute;
  width: 132px;
  color: #000;
  font-weight: 600;
  line-height: 17px;
  transform: translate(-83%, 0);
}

.first-radio {
  margin-top: 16px !important;
}

.radio-button {
  margin-top: 2px;
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