<template>
  <div class="correct-answer-form">
    <div class='left-border' />
    <div
      v-for="(input, idx) in $correctAnswerInputs"
      :key="input.id"
      class="correct-answer-input"
    >
      <BaseInput
        :value="input.value"
        placeholder="Введите правильный ответ"
        :class="{ input: true, empty: !input.value }"
        v-on="{
          ...$listeners,
          input: (value) => handleInputChange({ id: input.id, value }),
        }"
      />
      <div
        v-if="input.value && (idx === $correctAnswerInputs.length - 1)"
        class="icon-btn"
        @click="addInput"
      >
        <Icon
          class="icon-plus"
          type="plus"
          size="16"
        />
      </div>
      <div
        v-else
        class="icon-btn transparent"
        @click="removeInput({ id: input.id })"
      >
        <Icon
          class="icon-close"
          type="close"
          size="8"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BaseInput from '@/ui/input/BaseInput.vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  $correctAnswerInputs,
  setCorrectAnswerInputs,
} from '@/pages/bank/test-tasks/tasks/short-closed-answer/short-closed-answer.model'

export default Vue.extend({
  name: 'CorrectAnswerForm',
  components: {
    BaseInput,
    Icon,
  },
  effector: {
    $correctAnswerInputs,
  },
  methods: {
    handleInputChange({ id, value }) {
      const inputs = this.$correctAnswerInputs.map((input) =>
        input.id === id ? { id, value } : input
      )
      setCorrectAnswerInputs(inputs)
    },
    addInput() {
      setCorrectAnswerInputs([
        ...this.$correctAnswerInputs,
        { id: this.$correctAnswerInputs.length, value: '' },
      ])
    },
    removeInput({ id }) {
      const inputs = this.$correctAnswerInputs.filter((input) => input.id !== id)
      setCorrectAnswerInputs(inputs)
    },
  },
})
</script>

<style scoped>
.correct-answer-form {
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

.correct-answer-input {
  display: flex;
  align-items: center;

  & + .correct-answer-input {
    margin-top: 10px;
  }
}

.input {
  flex-grow: 1;
  height: 46px;
  padding: 8px 15px;
  background: #fdfdfd;
  border: 1px solid #d5dae1;
  box-sizing: border-box;
  border-radius: 5px;
  margin-right: 20px;
}

.empty {
  background-color: var(--base-bg-color);
  color: var(--c-grey-1);
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

.icon-plus {
  fill: #fff;
}
.icon-close {
  fill: var(--c-grey-3);
}
</style>
