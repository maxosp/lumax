<template>
  <div class="correct-text-answers">
    <FormLabel class="title">
      Область для ввода текста
    </FormLabel>
    <div class="columns">
      <div class="scope">Номер области</div>
      <div class="correct-match">
        Правильное соответствие
      </div>
    </div>

    <CorrectTextAnswerItem
      v-for="input in $inputs"
      :key="input.systemIndex"
      :answer="input"
      @change="replaceInput"
      @remove="removeInput"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FormLabel from '@/ui/label/FormLabel.vue'
import {
  $inputs,
  replaceInput,
  removeInput,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/moving-images-on-image-answer-form.model'
import CorrectTextAnswerItem from './CorrectTextAnswerItem.vue'

export default Vue.extend({
  name: `CorrectTextAnswers`,
  effector: {
    $inputs,
  },
  components: {
    CorrectTextAnswerItem,
    FormLabel,
  },
  methods: {
    replaceInput,
    removeInput,
  },
})
</script>

<style scoped>
.correct-text-answers {
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
.scope,
.correct-match {
  width: 50%;
  font-weight: bold;
  font-size: 14px;
  color: var(--base-text-primary);
}
.scope {
  width: 193px;
}
.variant {
  font-weight: normal;
}
</style>
