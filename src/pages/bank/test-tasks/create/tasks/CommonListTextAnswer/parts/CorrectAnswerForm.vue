<template>
  <div class="question-answers-form">
    <div class="left-border" />
    <div class="label">Текст</div>
    <Wysiwyg
      class="wysiwyg"
      editor-id="common-list-wysiwyg"
      listen-insertion
      :value="$textTemplate"
      @input="setTextTemplate"
    />
    <BaseCheckbox
      option="reorder"
      class="reorder-checkbox"
      :value="$reorderEnabled"
      @change="toggleReorderEnabling"
    >
      Отключить перемешивание
    </BaseCheckbox>
    <div class="correct-answers">
      <div
        v-for="(answer, idx) in $correctAnswers"
        :key="answer.id"
        class="correct-answer"
      >
        <BaseDropdown
          class="dropdown"
          :placeholder="answer.title"
          :value="answer.title"
          :label="idx === 0 ? 'Правильный ответ' : ''"
          read-only-dropdown
        >
          <template #default="{closeMenu}">
            <SelectItem
              v-for="item in $answersOptions"
              :key="item.name"
              :placeholder="item.title"
              @click="handleCorrectAnswerChange({ id: answer.id, value: item.title }, closeMenu)"
            >
              {{ item.title }}
            </SelectItem>
          </template>
        </BaseDropdown>
        <div
          v-if="$correctAnswers.length > 1 && idx !== $correctAnswers.length - 1"
          :class="{ transparent: true, 'icon-btn': true, 'first-icon': idx === 0 }"
          @click="removeCorrectAnswer({ id: answer.id })"
        >
          <Icon
            class="icon-close"
            type="close"
            size="8"
          />
        </div>
      </div>
      <div class="add-list" @click="addList">
        <BaseButton>Добавить список в текст</BaseButton>
      </div>
    </div>
    <div class="answers-options">
      <div
        v-for="(option, index) in $answersOptions"
        :key="option.id"
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
  </div>
</template>

<script>
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseCheckbox from '@/ui/checkbox/BaseCheckbox.vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import FormInput from '@/ui/input/FormInput.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import {
  $correctAnswers,
  setCorrectAnswers,
  $answersOptions,
  setAnswersOptions,
  $reorderEnabled,
  toggleReorderEnabling,
  $textTemplate,
  setTextTemplate,
} from '@/pages/bank/test-tasks/create/tasks/CommonListTextAnswer/common-list-text-answer.model'
import { getRandomId } from '@/pages/bank/test-tasks/create/tasks/utils'

export default Vue.extend({
  name: 'CorrectAnswerForm',
  components: {
    Icon,
    Wysiwyg,
    BaseButton,
    BaseCheckbox,
    BaseDropdown,
    SelectItem,
    FormInput,
  },
  effector: {
    $correctAnswers,
    $answersOptions,
    $reorderEnabled,
    $textTemplate,
  },
  watch: {
    $textTemplate: {
      handler(val, oldVal) {
        console.log('current', val)
        console.log('old', oldVal)
      },
    },
  },
  methods: {
    toggleReorderEnabling,
    setTextTemplate,
    setCorrectAnswers,
    handleCorrectAnswerChange({ id, value }, cb) {
      const correctAnswers = this.$correctAnswers.map((answer) =>
        answer.id === id ? { ...answer, name: value, title: value } : answer
      )
      setCorrectAnswers(correctAnswers)
      cb()
    },
    addCorrectAnswer() {
      setCorrectAnswers([...this.$correctAnswers, { id: getRandomId(), name: '', title: '' }])
    },
    removeCorrectAnswer({ id }) {
      const correctAnswers = this.$correctAnswers.filter((answer) => answer.id !== id)
      setCorrectAnswers(correctAnswers)
    },
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
    addList() {
      this.addCorrectAnswer()
      const event = new CustomEvent('insert', {
        detail: `<input id="input-${this.$correctAnswers.length}" type="" value="S${this.$correctAnswers.length}" />`,
      })
      const editor = document.querySelector('#common-list-wysiwyg')

      editor && editor.dispatchEvent(event)
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

.label {
  font-weight: bold;
  line-height: 17px;
  margin-bottom: 5px;
}

.wysiwyg,
.reorder-checkbox {
  margin-bottom: 20px;
}

.correct-answers,
.answers-options {
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
}

.answer-option {
  display: flex;
  align-items: center;
}

.answer-option-input {
  flex-grow: 1;
}

.first-icon {
  margin-top: 20px;
}

.icon-btn {
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

.transparent {
  background-color: transparent;
}

.icon-plus {
  fill: #fff;
}

.icon-close {
  fill: var(--c-grey-3);
}

.add-list {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>