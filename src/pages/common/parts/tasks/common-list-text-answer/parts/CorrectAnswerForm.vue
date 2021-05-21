<template>
  <div class="question-answers-form">
    <div class="left-border" />
    <div class="label">Текст</div>
    <Wysiwyg
      class="wysiwyg"
      editor-id="common-list-wysiwyg"
      listen-insertion
      :editor-index="2"
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
        <div
          :class="{ 's-bookmark': true, 'first-mark': idx === 0}"
        >
          S{{ answer.id + 1 }}
        </div>
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
          :class="{ transparent: true, 'icon-btn': true, 'first-icon': idx === 0 }"
          @click="removeCorrectAnswerFromEditor({ id: answer.id })"
        >
          <Icon
            class="icon-close"
            type="close"
            size="8"
          />
        </div>
      </div>
      <div class="add-list">
        <BaseButton @click="addList">Добавить список в текст</BaseButton>
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
} from '@/pages/common/parts/tasks/common-list-text-answer/common-list-text-answer.model'
import { getRandomId, getArraysDiff } from '@/pages/common/parts/tasks/utils'

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
        const valMatch = val.match(/<input(.*?)>/g)
        const oldValMatch = oldVal.match(/<input(.*?)>/g)
        if (val && valMatch && oldValMatch && valMatch.length < oldValMatch.length) {
          const oldInputsIds = this.getInputsIds(oldValMatch)
          const newInputsIds = this.getInputsIds(valMatch)
          const diffInputId = getArraysDiff(oldInputsIds, newInputsIds)[0]
          this.removeCorrectAnswerFromEditor({ id: +diffInputId })
        }
      },
    },
  },
  methods: {
    toggleReorderEnabling,
    setTextTemplate,
    setCorrectAnswers,
    getInputsIds(arr) {
      const idsString = arr.map((input) => input.match(/id="(\d+)"/g))
      return idsString.map((input) => input[0].match(/\d/g)[0])
    },
    handleCorrectAnswerChange({ id, value }, cb) {
      const correctAnswers = this.$correctAnswers.map((answer) =>
        answer.id === id ? { ...answer, name: value, title: value } : answer
      )
      setCorrectAnswers(correctAnswers)
      cb()
    },
    addCorrectAnswer({ id }) {
      setCorrectAnswers([...this.$correctAnswers, { id, name: '', title: '' }])
    },
    removeCorrectAnswerFromEditor({ id }) {
      const inputStr = `<input id="${id}" type="" value="`
      const indexOfInputBeginning = this.$textTemplate.indexOf(inputStr)
      const cuttedBeginning = this.$textTemplate.slice(indexOfInputBeginning)
      const indexOfInputEnding = cuttedBeginning.indexOf('/>')
      const inputToRemove = this.$textTemplate.slice(
        indexOfInputBeginning,
        // 2 - length of "/>" string
        indexOfInputBeginning + indexOfInputEnding + 2
      )
      let newTextTemplate = this.$textTemplate.replace(inputToRemove, '')
      const inputsIds = this.getInputsIds(newTextTemplate.match(/<input(.*?)>/g)).map((inputId) =>
        +inputId > id ? `${+inputId - 1}` : `${+inputId}`
      )
      newTextTemplate = newTextTemplate
        .match(/<input(.*?)>/g)
        .map((input) => {
          if (+input.match(/id="(\d+)"/)[1] === id) input.replace(/value="(.*?)"/, `value="0"`)
          return input
        })
        .map((input, index) => input.replace(/id="(\d+)"/, `id="${inputsIds[index]}"`))
        .map((input, index) => input.replace(/value="S(\d+)"/, `value="S${inputsIds[index]}"`))
      setTextTemplate(newTextTemplate.join(','))
      this.removeCorrectAnswer({ id })
    },
    removeCorrectAnswer({ id }) {
      let correctAnswers = JSON.parse(JSON.stringify(this.$correctAnswers)).filter(
        (answer) => answer.id !== id
      )
      correctAnswers = correctAnswers.map((answer) => {
        return answer.id > id ? { ...answer, id: answer.id - 1 } : answer
      })
      setCorrectAnswers(correctAnswers)
    },
    clearCorrectAnswers(changedOption) {
      const correctAnswers = this.$correctAnswers.map((answer) =>
        answer.title === changedOption.title ? { ...answer, name: '', title: '' } : answer
      )
      setCorrectAnswers(correctAnswers)
    },
    handleAnswerOptionChange({ id, value }) {
      let changedOption = this.$answersOptions.find((option) => option.id === id)
      changedOption = this.$answersOptions.filter((option) => option.name === changedOption.name)
      const answersOptions = this.$answersOptions.map((option) =>
        option.id === id ? { ...option, name: value, title: value } : option
      )
      setAnswersOptions(answersOptions)
      if (changedOption.length === 1) {
        this.clearCorrectAnswers(changedOption[0])
      }
    },
    addAnswerOption() {
      setAnswersOptions([...this.$answersOptions, { id: getRandomId(), name: '', title: '' }])
    },
    removeAnswerOption({ id }) {
      const deletedOption = this.$answersOptions.find((option) => option.id === id)
      const answersOptions = this.$answersOptions.filter((option) => option.id !== id)
      setAnswersOptions(answersOptions)
      this.clearCorrectAnswers(deletedOption)
    },
    addList() {
      const { length } = this.$correctAnswers
      const id = length ? this.$correctAnswers[length - 1].id + 1 : length
      this.addCorrectAnswer({ id })
      const event = new CustomEvent('insert', {
        detail: `<input id="${id + 1}" type="" placeholder="S${id + 1}" /> `,
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

.correct-answer,
.answer-option {
  position: relative;
  display: flex;
  align-items: center;
}

.s-bookmark {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 7px;
  background-color: var(--base-text-primary);
  width: 46px;
  height: 46px;
  top: 4px;
  left: -76px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.first-mark {
  top: 18px;
}

.dropdown,
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
