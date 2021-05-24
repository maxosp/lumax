<template>
  <div class="question-answers-form">
    <div class="left-border" />
    <div
      v-for="(qa, idx) in $questionsAnswers"
      :key="qa.id"
      class="question-answers"
    >
      <FormInput
        :label="idx === 0 ? 'Ответы' : ''"
        :value="qa.answer"
        placeholder="Введите вариант ответа"
        class="question-input"
        @input="(answer) => handleAnswerChange({ id: qa.id, answer })"
      />
      <div class="correct-radio">
        <div v-if="idx === 0" class="radio-label">Правильный ответ</div>
        <RadioButton
          option="is-correct"
          :class="[ 'radio-button', {'first-radio': idx === 0 }]"
          :value="qa.isCorrect ? 'is-correct' : 'non-correct'"
          @change="handleIsCorrectChange({ questionId: qa.id })"
        />
      </div>
      <div
        :class="[ 'icon-wrapper',{'first-icon-wrapper': idx === 0, '--invisible': $questionsAnswers.length === 1   }]"
      >
        <Icon
          class="remove-icon"
          size="10px"
          type="close"
          @click="removeQuestion({ questionId: qa.id })"
        />
      </div>
    </div>
    <div class="add-question">
      <BaseButton @click="addAnswer">Добавить вариант ответа</BaseButton>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import FormInput from '@/ui/input/FormInput.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import RadioButton from '@/ui/radio/RadioButton.vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  $questionsAnswers,
  setQuestionsAnswers,
} from '@/pages/common/parts/tasks/multiple-choice-one-answer/multiple-choice-one-answer.model'
import { getRandomId } from '@/pages/common/parts/tasks/utils'

export default Vue.extend({
  name: 'CorrectAnswerForm',
  components: {
    FormInput,
    BaseButton,
    RadioButton,
    Icon,
  },
  effector: {
    $questionsAnswers,
  },
  methods: {
    handleAnswerChange({ id, answer }) {
      const questionsAnswers = this.$questionsAnswers.map((qa) =>
        qa.id === id ? { ...qa, answer } : qa
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
      setQuestionsAnswers(questionsAnswers)
    },
    addAnswer() {
      setQuestionsAnswers([
        ...this.$questionsAnswers,
        { id: getRandomId(), answer: '', isCorrect: false },
      ])
    },
    removeQuestion({ questionId }) {
      const questionsAnswers = this.$questionsAnswers.filter((qa) => qa.id !== questionId)
      setQuestionsAnswers(questionsAnswers)
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

.question-input {
  flex-grow: 1;
}

.transparent {
  background-color: transparent;
}

.icon-wrapper {
  margin-top: 2px;
  display: flex;
  align-items: center;
  .remove-icon {
    fill: var(--base-text-primary);
  }
  &:hover {
    cursor: pointer;
  }
}
.first-icon-wrapper {
  margin-top: 16px;
}

.add-question {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--c-grey-11);
  display: flex;
  justify-content: center;
}
.--invisible {
  display: none;
}
</style>
