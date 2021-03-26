<template>
  <div class="correct-images-match-picker">
    <div v-if="$draggableImages.length" class="correct-match">
      Правильное соответствие
    </div>
    <ImageMatchItem
      v-for="image in $draggableImages"
      :key="image.id"
      :image="image"
      :droppable-images="$droppableImages"
      @remove="removeDraggableImage"
      @change="replaceDraggableImage"
    />

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
import {
  $draggableImages,
  removeDraggableImage,
  replaceDraggableImage,
  $droppableImages,
} from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/form/moving-images-on-image-answer-form.model'
import ImageMatchItem from './ImageMatchItem.vue'

export default Vue.extend({
  name: `CorrectImagesMatchPicker`,
  effector: {
    $draggableImages,
    $droppableImages,
  },
  components: {
    BaseButton,
    ImageMatchItem,
  },
  methods: {
    replaceDraggableImage,
    removeDraggableImage,
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
  width: 60%;

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
