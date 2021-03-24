<template>
  <div class="moving-images-image-input-answer-form">
    <DragAndDropImageContainer class="drag-and-drop" />
    <template v-if="!$hideDragAndDropControls">
      <ImagesUploader class="uploader" />
      <CorrectImagesMatchPicker class="images-match-picker" />
      <CorrectTextMatchPicker class="text-match-picker" />
      <CorrectTextAnswers v-if="$inputs.length" />
    </template>
    <div class="left-border" />
  </div>
</template>

<script>
import Vue from 'vue'
import {
  $hideDragAndDropControls,
  $inputs,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/form/moving-images-on-image-answer-form.model'
import DragAndDropImageContainer from '../parts/drag-and-drop-image-container/DragAndDropImageContainer.vue'
import ImagesUploader from '../parts/ImagesUploader.vue'
import CorrectImagesMatchPicker from '../parts/correct-images-match-picker/CorrectImagesMatchPicker.vue'
import CorrectTextMatchPicker from '../parts/correct-text-match-picker/CorrectTextMatchPicker.vue'
import CorrectTextAnswers from '../parts/correct-text-answers/CorrectTextAnswers.vue'

export default Vue.extend({
  name: 'MovingImagesOnImageInputAnswerForm',
  effector: {
    $hideDragAndDropControls,
    $inputs,
  },
  components: {
    CorrectTextAnswers,
    CorrectTextMatchPicker,
    CorrectImagesMatchPicker,
    ImagesUploader,
    DragAndDropImageContainer,
  },
})
</script>

<style scoped>
.moving-images-image-input-answer-form {
  position: relative;
}
.drag-and-drop {
  margin-bottom: 10px;
}
.uploader {
  margin-bottom: 16px;
}
.images-match-picker {
  margin-bottom: 20px;
}
.text-match-picker {
  margin-bottom: 20px;
}
.left-border {
  position: absolute;
  top: 0;
  left: -30px;
  width: 4px;
  height: 100%;
  background-color: var(--c-yellow-3);
}
</style>
