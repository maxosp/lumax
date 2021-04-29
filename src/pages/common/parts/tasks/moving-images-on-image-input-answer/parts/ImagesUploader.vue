<template>
  <div class="images-uploader">
    <FormLabel class="label">Перемещаемые изображения</FormLabel>
    <FileInput
      accept="image/*"
      placeholder="Перетащите изображение в поле или выберите из"
      @change="uploadDraggableImage"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FileInput from '@/ui/audio-file-input/AudioFileInput.vue'
import FormLabel from '@/ui/label/FormLabel.vue'
import { uploadDraggableImage } from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/form/moving-images-on-image-answer-form.model'

export default Vue.extend({
  name: `ImagesUploader`,
  components: {
    FileInput,
    FormLabel,
  },
  methods: {
    uploadDraggableImage,
  },
})
</script>

<style scoped>
.images-uploader {
}
.label {
  margin-bottom: 10px;
}
</style>
