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
    <div class="add-list" @click="addList">
      <BaseButton>Добавить список в текст</BaseButton>
    </div>
    <div class="answers-lists">
      <div
        v-for="(list, idx) in $answersList"
        :key="list.id"
        class="answers-list-item"
      >
        <div class="s-bookmark">
          S{{ idx + 1 }}
        </div>
        <div
          class="remove-list"
          @click="removeAnswersList({ id: list.id })"
        >
          Удалить список
        </div>
        <div
          v-for="(answer, index) in list.answers"
          :key="answer.id"
          class="answer"
        >
          <FormInput
            :label="index === 0 ? `Список ${idx + 1}` : ''"
            :value="answer.value"
            placeholder="Введите ответ"
            class="input"
            @input="(value) => handleAnswerChange({ id: answer.id, listId: list.id, value })"
          />
          <div
            v-if="index === list.answers.length - 1"
            :class="{ 'icon-btn': true, 'first-icon': index === 0 }"
            @click="addAnswer({ id: list.id })"
          >
            <Icon
              class="icon-plus"
              type="plus"
              size="16"
            />
          </div>
          <div class="controls-container">
            <div class="correct-radio">
              <div v-if="index === 0" class="radio-label">Правильный ответ</div>
              <RadioButton
                option="is-correct"
                :class="{ 'radio-button': true, 'first-radio': index === 0 }"
                :value="answer.isCorrect ? 'is-correct' : 'non-correct'"
                @change="handleIsCorrectChange({ id: answer.id, listId: list.id })"
              />
            </div>
            <div
              class="transparent icon-btn icon-close-container"
              :class="{ 'first-icon': index === 0 }"
              @click="removeAnswer({ id: list.id, answerId: answer.id })"
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
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseCheckbox from '@/ui/checkbox/BaseCheckbox.vue'
import RadioButton from '@/ui/radio/RadioButton.vue'
import FormInput from '@/ui/input/FormInput.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import {
  $answersList,
  setAnswersList,
  $reorderEnabled,
  toggleReorderEnabling,
  $textTemplate,
  setTextTemplate,
} from '@/pages/bank/test-tasks/create/tasks/multiple-list-text-answer/multiple-list-text-answer.model'
import {
  getRandomId,
  getInputsIds,
  getArraysDiff,
} from '@/pages/bank/test-tasks/create/tasks/utils'

export default Vue.extend({
  name: 'CorrectAnswerForm',
  components: {
    Icon,
    Wysiwyg,
    BaseButton,
    BaseCheckbox,
    RadioButton,
    FormInput,
  },
  effector: {
    $answersList,
    $reorderEnabled,
    $textTemplate,
  },
  watch: {
    $textTemplate: {
      handler(val, oldVal) {
        if (val.split('<input').length < oldVal.split('<input').length) {
          const oldInputsIds = getInputsIds(oldVal)
          const newInputsIds = getInputsIds(val)

          const diffInputId = getArraysDiff(oldInputsIds, newInputsIds)[0]
          this.removeAnswersList({ id: diffInputId })
        }
      },
    },
  },
  methods: {
    toggleReorderEnabling,
    setTextTemplate,
    setAnswersList,
    handleAnswerChange({ listId, id, value }) {
      const answersList = this.$answersList.map((list) =>
        list.id === listId
          ? {
              ...list,
            answers: list.answers.map(answer => answer.id === id
              ? { ...answer, value }
              : answer
            )
          }
          : list
      )
      setAnswersList(answersList)
    },
    handleIsCorrectChange({ listId, id }) {
      const answersList = this.$answersList.map((list) =>
        list.id === listId
          ? {
              ...list,
            answers: list.answers.map(answer => {
              if (answer.id === id) {
                if (answer.isCorrect) {
                  return answer
                }
                return { ...answer, isCorrect: true }
              }
              return { ...answer, isCorrect: false }
            })
          }
          : list
      )
      setAnswersList(answersList)
    },
    addAnswer({ id }) {
      const answersList = this.$answersList.map((list) =>
        list.id === id
        ? { ...list, answers: [...list.answers, { id: getRandomId(), value: '' }] }
        : list
      )
      setAnswersList(answersList)
    },
    removeAnswer({ id, answerId }) {
      let answersList = this.$answersList.map((list) =>
        list.id === id
        ? { ...list, answers: list.answers.filter(answer => answer.id !== answerId) }
        : list
      )
      if (answersList.find(list => list.id === id).answers.length === 0) {
        this.removeAnswersList({ id })
      }
      setAnswersList(answersList)
    },
    addAnswersList({ id }) {
      setAnswersList([
        ...this.$answersList,
        {
          id,
          answers: [
            {
              id: getRandomId(),
              name: '',
              title: '',
              isCorrect: false,
            },
          ],
        },
      ])
    },
    removeAnswersList({ id }) {
      const answersList = this.$answersList.filter((list) => list.id !== id)
      setAnswersList(answersList)

      // remove from editor
      const inputStr = `<input id="${id}" type="" value="`
      const indexOfInputBeginning = this.$textTemplate.indexOf(inputStr)
      const cuttedBeginning = this.$textTemplate.slice(indexOfInputBeginning)
      const indexOfInputEnding = cuttedBeginning.indexOf('/>')
      const inputToRemove = this.$textTemplate.slice(
        indexOfInputBeginning,
        // 2 - length of "/>" string
        indexOfInputBeginning + indexOfInputEnding + 2
      )
      const newTextTemplate = this.$textTemplate.replace(inputToRemove, '')
      setTextTemplate(newTextTemplate)
    },
    addList() {
      const id = `input-${getRandomId()}`
      this.addAnswersList({ id })
      const event = new CustomEvent('insert', {
        detail: `<input id="${id}" type="" value="S${this.$answersList.length}" />`,
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

.answers-lists {
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
}

.answers-list-item {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--c-grey-11);
  margin-bottom: 15px;
}

.answer {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
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
  top: 20px;
  left: -76px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.remove-list {
  cursor: pointer;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 80px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: var(--base-text-secondary);
}

.input {
  flex-grow: 1;
  max-width: 310px;
}

.first-icon {
  margin-top: 20px;
}

.controls-container {
  display: flex;
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
  top: 0;
  transform: translate(-83%, 0);
}

.first-radio {
  margin-top: 16px !important;
}

.radio-button {
  margin-top: 2px;
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

.icon-close-container {
  margin-left: 0;
}

.add-list {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
</style>
