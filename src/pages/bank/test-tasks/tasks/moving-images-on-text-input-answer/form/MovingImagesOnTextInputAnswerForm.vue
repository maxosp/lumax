<template>
  <div class="moving-images-text-input-answer">
    <TextAnswerWysiwyg class="text-answer-wysiwyg" />
    <ImagesUploader class="uploader" />
    <CorrectImagesMatchPicker class="images-match-picker" />
    <CorrectTextMatchPicker class="text-match-picker" />
    <AreasForAttachingImages class="areas-for-images" />
    <AreasForAttachingText class="areas-for-text" />
    <div class="left-border" />
  </div>
</template>

<script>
import Vue from 'vue'
import ImagesUploader from '../parts/ImagesUploader.vue'
import CorrectImagesMatchPicker from '../parts/correct-images-match-picker/CorrectImagesMatchPicker.vue'
import CorrectTextMatchPicker from '../parts/correct-text-match-picker/CorrectTextMatchPicker.vue'
import TextAnswerWysiwyg from '../parts/text-answer-wysiwyg/TextAnswerWysiwyg.vue'
import AreasForAttachingImages from '../parts/areas-for-attaching-images/AreasForAttachingImages.vue'
import AreasForAttachingText from '../parts/areas-for-attaching-text/AreasForAttachingText.vue'

export default Vue.extend({
  name: 'MovingImagesOnTextInputAnswerForm',
  components: {
    AreasForAttachingText,
    AreasForAttachingImages,
    TextAnswerWysiwyg,
    CorrectTextMatchPicker,
    CorrectImagesMatchPicker,
    ImagesUploader,
  },
})
</script>

<style scoped>
.moving-images-text-input-answer {
  position: relative;
}
.areas-for-images {
  margin-bottom: 10px;
}
.text-match-picker {
  margin-bottom: 20px;
}
.text-answer-wysiwyg {
  margin-bottom: 20px;
}
.uploader {
  margin-bottom: 16px;
}
.images-match-picker {
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
