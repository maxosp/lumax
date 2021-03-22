<template>
  <div class="text-answer-wysiwyg">
    <div class="header">
      <FormLabel>Текст</FormLabel>
      <div class="actions">
        <BaseButton class="add-image button">+ изображение</BaseButton>
        <BaseButton class="button">+ текст</BaseButton>
      </div>
    </div>
    <div class="text-container" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import FormLabel from '@/ui/label/FormLabel.vue'

export default Vue.extend({
  name: `TextAnswerWysiwyg`,
  components: {
    FormLabel,
    BaseButton,
  },
})
</script>

<style scoped>
.text-answer-wysiwyg {
  position: relative;
}

.text-container {
  width: 100%;
  height: 180px;
  left: 180px;
  top: 1397px;
  background: var(--c-grey-5);
  border: 1px solid var(--c-grey-4);
  box-sizing: border-box;
  border-radius: 5px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.add-image {
  margin-right: 10px;
}

.actions {
  display: flex;
  align-items: center;
}

.button {
  padding: 3px 10px;
  font-size: 14px;
  font-weight: normal;
  height: auto;
}
</style>
