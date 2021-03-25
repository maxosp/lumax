<template>
  <div class="areas-for-attaching-images">
    <FormLabel class="title">Область для ввода текста</FormLabel>

    <div class="table">

      <div v-if="$inputs.length" class="row">
        <div class="cell header-cell">
          Номер области
        </div>

        <div class="cell header-cell">
          Правильный ответ
        </div>

        <div class="cell header-cell">
          Размер
        </div>

        <div class="cell header-cell color-cell">
          Цвет
        </div>
      </div>
      <div v-else class="instruction">
        Добавьте область для ввода текста в поле "Текст"
      </div>

      <AttachingTextItem
        v-for="input in $inputs"
        :key="input.id"
        :answer="input"
        @change="replaceInput"
        @remove="removeInput"
      />

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FormLabel from '@/ui/label/FormLabel.vue'
import {
  $inputs,
  replaceInput,
  removeInput,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-text-input-answer/form/moving-images-on-text-input-answer-form.model'
import AttachingTextItem from './AttachingTextItem.vue'

export default Vue.extend({
  name: `AreasForAttachingText`,
  components: {
    FormLabel,
    AttachingTextItem,
  },
  effector: {
    $inputs,
  },
  methods: {
    replaceInput,
    removeInput,
  },
})
</script>

<style scoped>
.title {
  margin-bottom: 10px;
}
.table {
  display: table;
  width: 100%;
}
.row {
  display: table-row;
}
.color-cell {
  width: 50px;
}
.cell {
  display: table-cell;
}
.instruction {
  @mixin flex-center;
  background: var(--c-grey-5);
  border: 1px solid var(--c-grey-2);
  color: var(--c-grey-3);
  border-radius: 3px;
  padding: 20px;
}
.header-cell {
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  padding-bottom: 8px;
}
</style>
