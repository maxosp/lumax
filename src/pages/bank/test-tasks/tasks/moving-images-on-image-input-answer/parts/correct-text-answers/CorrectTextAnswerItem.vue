<template>
  <div class="correct-text-answer-item">
    <FormInput
      :value="`B${answer.id}`"
      class="scope"
    />
    <div class="answers">

      <div
        v-for="(textAnswer, i) in answer.value"
        :key="textAnswer.id"
        class="answer"
      >
        <FormInput
          :value="textAnswer.value"
          class="answer-input"
          placeholder="Введите ответ"
          @input="editAnswer(i, $event)"
        />
        <div class="actions">
          <BaseButton
            v-if="i === answer.value.length - 1"
            class="add-value"
            @click="addAnswer"
          >
            +
          </BaseButton>
          <Icon
            class="remove-icon"
            size="12px"
            type="close"
            @click="removeAnswer(i)"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import FormInput from '@/ui/input/FormInput.vue'
import Icon from '@/ui/icon/Icon.vue'
import { DroppableInput } from '@/pages/bank/test-tasks/tasks/types'
import { inputsValuesCounter } from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/form/moving-images-on-image-answer-form.model'
import BaseButton from '@/ui/button/BaseButton.vue'

export default Vue.extend({
  name: `CorrectTextAnswerItem`,
  components: {
    BaseButton,
    Icon,
    FormInput,
  },
  props: {
    answer: {
      type: Object as PropType<DroppableInput>,
      required: true,
    },
  },
  methods: {
    addAnswer() {
      this.$emit('change', {
        ...this.answer,
        value: [
          ...this.answer.value,
          {
            value: '',
            id: inputsValuesCounter.next(),
          },
        ],
      })
    },
    removeAnswer(i: number) {
      if (this.answer.value.length === 1) {
        this.$emit('remove', this.answer)
        return
      }

      const value = [...this.answer.value]
      value.splice(i, 1)

      this.$emit('change', {
        ...this.answer,
        value,
      })
    },
    editAnswer(i: number, newValue: string) {
      const value = [...this.answer.value]
      const { id } = value[i]
      value.splice(i, 1, {
        value: newValue,
        id,
      })

      this.$emit('change', {
        ...this.answer,
        value,
      })
    },
  },
})
</script>

<style scoped>
.add-value {
  width: 36px;
  height: 36px;
  padding: 0;
  @mixin flex-center;
  margin-right: 20px;
  font-size: 20px;
}
.answers {
  flex: 1;
}
.correct-text-answer-item {
  display: flex;
  margin-bottom: 10px;
  width: 100%;
  &:last-child {
    margin-bottom: 0;
  }
}
.scope {
  width: 173px;
  margin-right: 20px;
  pointer-events: none;
}
.answer {
  display: flex;
  align-items: center;
  flex: 1;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.answer-input {
  flex: 1;
}
.actions {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.remove-icon {
  cursor: pointer;
  fill: var(--c-grey-3);
}
</style>
