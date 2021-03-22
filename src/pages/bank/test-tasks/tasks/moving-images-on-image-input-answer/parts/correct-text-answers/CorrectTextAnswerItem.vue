<template>
  <div class="correct-text-answer-item">
    <FormInput
      :value="answer.systemIndex"
      class="scope"
    />
    <div class="answers">

      <div class="answer">
        <FormInput
          :value="answer.value"
          class="answer-input"
          placeholder="Введите ответ"
          @input="$emit('change', {
            ...answer,
            value: $event,
          })"
        />
        <div class="actions">
          <Icon
            class="remove-icon"
            size="12px"
            type="close"
            @click="$emit('remove', value)"
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

export default Vue.extend({
  name: `CorrectTextAnswerItem`,
  components: {
    Icon,
    FormInput,
  },
  props: {
    answer: {
      type: Object as PropType<DroppableInput>,
      required: true,
    },
  },
})
</script>

<style scoped>
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
