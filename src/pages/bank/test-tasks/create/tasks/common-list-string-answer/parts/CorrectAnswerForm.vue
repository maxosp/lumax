<template>
  <div class="question-answers-form">
    <div class="left-border" />
    <div class="answers-options">
      <div
        v-for="(option, index) in $answersOptions"
        :key="`${option.name}-${index}`"
        class="answer-option"
      >
        <FormInput
          :label="index === 0 ? 'Варианты ответов в списке' : ''"
          :value="option.title"
          placeholder="Введите вариант ответа"
          class="answer-option-input"
          @input="(value) => handleAnswerOptionChange({ id: option.id, value })"
        />
        <div
          v-if="index === $answersOptions.length - 1"
          :class="{ 'icon-btn': true, 'first-icon': index === 0 }"
          @click="addAnswerOption"
        >
          <Icon
            class="icon-plus"
            type="plus"
            size="16"
          />
        </div>
        <div
          v-if="$answersOptions.length > 1 && index !== $answersOptions.length - 1"
          :class="{ transparent: true, 'icon-btn': true, 'first-icon': index === 0 }"
          @click="removeAnswerOption({ id: option.id })"
        >
          <Icon
            class="icon-close"
            type="close"
            size="8"
          />
        </div>
      </div>
    </div>
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
      <BaseDropdown
        class="answer-dropdown"
        :value="qa.answer"
        :label="idx === 0 ? 'Правильный ответ' : ''"
        placeholder="Выберите ответ"
        read-only-dropdown
        @clear="handleClearAnswerDropdown({ id: qa.id })"
      >
        <template #default="{closeMenu}">
          <div v-if="$answersOptions.length">
            <SelectItem
              v-for="item in $answersOptions"
              :key="item.name"
              :placeholder="item.title"
              @click="onSelectAnswerOption({ id: qa.id, answer: item.title }, closeMenu)"
            >
              {{ item.title }}
            </SelectItem>
          </div>
          <div v-else>
            <SelectItem @click="closeMenu">Нет вариантов ответа</SelectItem>
          </div>
        </template>
      </BaseDropdown>
      <div
        v-if="$questionsAnswers.length > 1"
        :class="{ transparent: true, 'icon-btn': true, 'first-icon': idx === 0 }"
        @click="removeQuestion({ id: qa.id })"
      >
        <Icon
          class="icon-close"
          type="close"
          size="8"
        />
      </div>
    </div>
    <div class="add-question" @click="addQuestion">
      <BaseButton>Добавить сопоставление</BaseButton>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import FormInput from '@/ui/input/FormInput.vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $answersOptions,
  setAnswersOptions,
  $questionsAnswers,
  setQuestionsAnswers,
} from '@/pages/bank/test-tasks/create/tasks/common-list-string-answer/common-list-string-answer.model'
import { getRandomId } from '@/pages/bank/test-tasks/create/tasks/utils'

export default Vue.extend({
  name: 'CorrectAnswerForm',
  components: {
    Icon,
    FormInput,
    BaseDropdown,
    SelectItem,
    BaseButton,
  },
  effector: {
    $answersOptions,
    $questionsAnswers,
  },
  methods: {
    handleAnswerOptionChange({ id, value }) {
      const answersOptions = this.$answersOptions.map((option) =>
        option.id === id ? { ...option, name: value, title: value } : option
      )
      setAnswersOptions(answersOptions)
    },
    addAnswerOption() {
      setAnswersOptions([...this.$answersOptions, { id: getRandomId(), name: '', title: '' }])
    },
    removeAnswerOption({ id }) {
      const answersOptions = this.$answersOptions.filter((option) => option.id !== id)
      setAnswersOptions(answersOptions)
    },
    handleQuestionChange({ id, question }) {
      const questionsAnswers = this.$questionsAnswers.map((qa) =>
        qa.id === id ? { ...qa, question } : qa
      )
      setQuestionsAnswers(questionsAnswers)
    },
    onSelectAnswerOption({ id, answer }, cb) {
      const questionsAnswers = this.$questionsAnswers.map((qa) =>
        qa.id === id ? { ...qa, answer } : qa
      )
      setQuestionsAnswers(questionsAnswers)
      cb()
    },
    addQuestion() {
      setQuestionsAnswers([
        ...this.$questionsAnswers,
        { id: getRandomId(), question: '', answer: '' },
      ])
    },
    removeQuestion({ id }) {
      const questionsAnswers = this.$questionsAnswers.filter((qa) => qa.id !== id)
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

.answers-options {
  margin-bottom: 25px;
}

.question-answers {
  display: flex;
  border-bottom: 1px solid var(--c-grey-11);
  padding-bottom: 8px;

  & + .question-answers {
    margin-top: 10px;
  }
}

.answer-option {
  display: flex;
}

.answer-option-input,
.question-input {
  flex-grow: 1;
}

.answer-dropdown {
  margin-left: 15px;
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
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
