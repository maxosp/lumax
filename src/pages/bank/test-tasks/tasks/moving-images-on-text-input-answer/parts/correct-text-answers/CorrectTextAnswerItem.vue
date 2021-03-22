<template>
  <div class="correct-text-answer-item">
    <FormInput class="scope" value="B1" />
    <div class="answers">

      <div class="answer">
        <FormInput
          class="answer-input"
          placeholder="Введите ответ"
        />
        <div class="actions">
          <Icon
            class="remove-icon"
            size="12px"
            type="close"
          />
        </div>
      </div>

      <div class="answer">
        <FormInput
          class="answer-input"
          placeholder="Введите ответ"
        />
        <div class="actions">
          <BaseButton class="add">+</BaseButton>
          <Icon
            class="remove-icon"
            size="12px"
            type="close"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FormInput from '@/ui/input/FormInput.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  name: `CorrectTextAnswerItem`,
  components: {
    Icon,
    BaseButton,
    FormInput,
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
.add {
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  font-weight: normal;
  margin-right: 20px;
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
