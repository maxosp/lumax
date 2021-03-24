<template>
  <div class="attaching-images-item">
    <div class="cell">
      <FormInput
        :value="answer.systemIndex"
        class="scope-key"
      />
    </div>
    <div class="cell">
      <div
        v-for="(textAnswer, i) in answer.value"
        :key="textAnswer.systemIndex"
        class="answer"
      >
        <FormInput
          :value="textAnswer.value"
          class="answer-input"
          placeholder="Правильный ответ"
          @input="editAnswer(i, $event)"
        />
        <div class="add-button-wrapper">
          <BaseButton
            v-if="i === answer.value.length - 1"
            class="add-button"
            @click="addAnswer"
          >
            +
          </BaseButton>
        </div>
      </div>
    </div>
    <div class="cell">
      <SizeInput
        :size="answer.size"
        class="sizes"
        @change="$emit('change', {
          ...answer,
          size: $event,
        })"
      />
    </div>
    <div class="cell">
      <div class="actions">
        <ColorPicker
          :color="answer.color"
          class="color-picker"
          @change="$emit('change', {
            ...answer,
            color: $event,
          })"
        />
        <div class="remove-icons">
          <Icon
            v-for="(textAnswer, i) in answer.value"
            :key="textAnswer.systemIndex"
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
import BaseButton from '@/ui/button/BaseButton.vue'
import SizeInput from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/SizeInput.vue'
import { MovingOnTextDroppableInput } from '@/pages/bank/test-tasks/tasks/types'
import { textInputsCounter } from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/form/moving-images-on-image-answer-form.model'
import ColorPicker from '../areas-for-attaching-images/ColorPicker.vue'

export default Vue.extend({
  name: `AttachingTextItem`,
  components: {
    SizeInput,
    BaseButton,
    Icon,
    FormInput,
    ColorPicker,
  },
  props: {
    answer: {
      type: Object as PropType<MovingOnTextDroppableInput>,
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
            systemIndex: textInputsCounter.next(),
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
      const { systemIndex } = value[i]
      value.splice(i, 1, {
        value: newValue,
        systemIndex,
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
.attaching-images-item {
  display: table-row;
}
.sizes {
  margin-top: 10px;
}
.actions {
  display: flex;
  align-items: flex-start;
}
.cell {
  display: table-cell;
  vertical-align: top;
  padding-bottom: 10px;
}
.color-picker {
  margin-right: 19px;
  margin-top: 8px;
}
.scope-key {
  width: 112px;
}
.remove-icon {
  cursor: pointer;
  fill: var(--c-grey-3);
  margin-top: 48px;
  &:first-child {
    margin-top: 20px;
  }
}
.answer {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.add-button-wrapper {
  width: 70px;
}
.answer-input {
  flex: 1;
  margin-right: 10px;
}
.add-button {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: normal;
}
.remove-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
