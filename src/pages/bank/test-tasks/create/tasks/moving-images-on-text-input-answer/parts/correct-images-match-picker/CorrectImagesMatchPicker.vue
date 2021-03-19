<template>
  <div class="correct-images-match-picker">
    <div class="correct-match">
      Правильное соответствие
    </div>
    <ImageMatchItem />
    <ImageMatchItem />
    <ImageMatchItem />

    <div class="actions">
      <BaseButton>
        Выбрать из системных файлов
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import ImageMatchItem from './ImageMatchItem.vue'

export default Vue.extend({
  name: `CorrectImagesMatchPicker`,
  components: {
    BaseButton,
    ImageMatchItem,
  },
})
</script>

<style scoped>
.correct-images-match-picker {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  position: relative;
}
.correct-match {
  width: 50%;

  font-weight: bold;
  font-size: 14px;
  color: var(--base-text-primary);
  margin-bottom: 10px;
}
.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  width: 100%;
}
</style>
