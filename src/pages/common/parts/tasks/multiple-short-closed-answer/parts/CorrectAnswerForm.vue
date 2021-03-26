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
      <BaseTextarea
        :label="idx === 0 ? 'Вопрос' : ''"
        :value="qa.question"
        placeholder="Введите вопрос"
        class="textarea"
        @input="(question) => handleQuestionChange({ id: qa.id, question })"
      />
      <div class="answers">
        <div
          v-for="(answer, asnwerIdx) in qa.answers"
          :key="`${qa.id}-${answer.id}`"
          class="answer-container"
        >
          <FormInput
            :label="idx === 0 && asnwerIdx === 0 ? 'Ответ' : ''"
            :value="answer.value"
            placeholder="Введите ответ"
            class="answer-input"
            @input="(value) => handleAnswerChange({ questionId: qa.id, id: answer.id, value })"
          />
          <FormInput
            v-if="$marksEnabled"
            :label="idx === 0 && asnwerIdx === 0 ? 'Баллы' : ''"
            :value="answer.mark"
            placeholder="Баллов"
            class="answer-mark"
            @input="(mark) => handleMarkChange({ questionId: qa.id, id: answer.id, mark })"
          />
          <div
            v-if="asnwerIdx === 0"
            :class="{ 'icon-btn': true, 'first-icon': idx === 0 && asnwerIdx === 0 }"
            @click="addAnswer({ questionId: qa.id })"
          >
            <Icon
              class="icon-plus"
              type="plus"
              size="16"
            />
          </div>
          <div
            v-if="qa.answers.length > 1 || $questionsAnswers.length > 1"
            :class="{ transparent: true, 'icon-btn': true, 'first-icon': idx === 0 && asnwerIdx === 0 }"
            @click="removeAnswerOrQuestion({ questionId: qa.id, id: answer.id, removeQuestion: qa.answers.length === 1 })"
          >
            <Icon
              class="icon-close"
              type="close"
              size="8"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="add-question" @click="addQuestion">
      <BaseButton>Добавить вопрос</BaseButton>
    </div>
  </div>
</template>

<script>
/* eslint-disable prettier-vue/prettier */
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import FormInput from '@/ui/input/FormInput.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseTextarea from '@/ui/input/BaseTextarea.vue'
import {
  $marksEnabled,
  toggleMarksEnabling,
  $questionsAnswers,
  setQuestionsAnswers,
} from '@/pages/common/parts/tasks/multiple-short-closed-answer/multiple-short-closed-answer.model'
import { getRandomId } from '@/pages/common/parts/tasks/utils'

export default Vue.extend({
  name: 'CorrectAnswerForm',
  components: {
    Icon,
    FormInput,
    BaseSwitch,
    BaseButton,
    BaseTextarea,
  },
  effector: {
    $marksEnabled,
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
    handleAnswerChange({ questionId, id, value }) {
      const questionsAnswers = this.$questionsAnswers.map((qa) =>
        qa.id === questionId
          ? {
            ...qa,
            answers: qa.answers.map((ans) => (ans.id === id ? { ...ans, value } : ans)),
          }
          : qa
      )
      setQuestionsAnswers(questionsAnswers)
    },
    handleMarkChange({ questionId, id, mark }) {
      const questionsAnswers = this.$questionsAnswers.map((qa) =>
        qa.id === questionId
          ? {
            ...qa,
            answers: qa.answers.map((ans) => (ans.id === id ? { ...ans, mark } : ans)),
          }
          : qa
      )
      setQuestionsAnswers(questionsAnswers)
    },
    addAnswer({ questionId }) {
      const questionsAnswers = this.$questionsAnswers.map((qa) =>
        qa.id === questionId
          ? {
            ...qa,
            answers: [...qa.answers, { id: getRandomId(), value: '', mark: '' }],
          }
          : qa
      )
      setQuestionsAnswers(questionsAnswers)
    },
    removeAnswerOrQuestion({ questionId, id, removeQuestion }) {
      let questionsAnswers = this.$questionsAnswers.map((qa) =>
        qa.id === questionId
          ? {
            ...qa,
            answers: qa.answers.filter((ans) => ans.id !== id),
          }
          : qa
      )
      if (removeQuestion) {
        questionsAnswers = this.$questionsAnswers.filter(qa => qa.id !== questionId)
      }
      setQuestionsAnswers(questionsAnswers)
    },
    addQuestion() {
      setQuestionsAnswers([
        ...this.$questionsAnswers,
        { id: getRandomId(), question: '', answers: [{ id: 0, value: '', mark: '' }] }
      ])
    }
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
  padding-bottom: 8px;
  border-bottom: 1px solid var(--c-grey-11);
}

.answer-container,
.question-answers {
  display: flex;

  & + .question-answers {
    margin-top: 10px;
  }
}

.answers {
  display: flex;
  flex-direction: column;
}

.toggler {
  margin-top: 0px;
  margin-bottom: 20px;
}

.textarea {
  flex-grow: 1;
}

.answer-input,
.answer-mark,
.icon-btn {
  max-width: 150px;
  margin-left: 10px;
}

.icon-btn {
  margin-top: 5px;
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
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
