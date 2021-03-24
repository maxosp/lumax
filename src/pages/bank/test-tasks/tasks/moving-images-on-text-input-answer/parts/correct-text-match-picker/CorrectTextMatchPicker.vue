<template>
  <div class="correct-text-match-picker">
    <FormLabel class="title">
      Перемещаемый текст
    </FormLabel>
    <div v-if="$draggableText.left" class="columns">
      <div class="variant">Вариант ответа</div>
    </div>
    <TextMatchItem
      v-for="item in $draggableText"
      :key="item.systemIndex"
      :value="item"
      @change="replace"
      @remove="remove"
    />

    <div class="actions">
      <BaseButton @click="add">
        Добавить текст
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import FormLabel from '@/ui/label/FormLabel.vue'
import {
  $draggableText,
  replaceDraggableText,
  addDraggableText,
  removeDraggableText,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-text-input-answer/form/moving-images-on-text-input-answer-form.model'
import TextMatchItem from './TextMatchItem.vue'

export default Vue.extend({
  name: `CorrectTextMatchPicker`,
  effector: {
    $draggableText,
  },
  components: {
    FormLabel,
    BaseButton,
    TextMatchItem,
  },
  methods: {
    add: addDraggableText,
    replace: replaceDraggableText,
    remove: removeDraggableText,
  },
})
</script>

<style lang="scss" scoped>
.correct-text-match-picker {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  position: relative;
}
.columns {
  display: flex;
  width: 100%;
  margin-bottom: 5px;
}
.title {
  margin-bottom: 10px;
}
.variant,
.correct-match {
  width: 50%;
  font-weight: bold;
  font-size: 14px;
  color: var(--base-text-primary);
}
.variant {
  font-weight: normal;
}
.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  width: 100%;
}
</style>
