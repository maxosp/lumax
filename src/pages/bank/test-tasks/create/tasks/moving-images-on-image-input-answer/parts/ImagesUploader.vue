<template>
  <div class="images-uploader">
    <FormLabel class="label">Перемещаемые изображения</FormLabel>
    <FileInput
      accept="image/*"
      placeholder="Перетащите изображение в поле или выберите из файлов"
      @change="uploadDroppableImage"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FileInput from '@/ui/audio-file-input/AudioFileInput.vue'
import FormLabel from '@/ui/label/FormLabel.vue'
import { uploadDraggableImage } from '@/pages/bank/test-tasks/create/tasks/moving-images-on-image-input-answer/moving-images-on-image-answer-form.model'

export default Vue.extend({
  name: `ImagesUploader`,
  components: {
    FileInput,
    FormLabel,
  },
  methods: {
    uploadDroppableImage: uploadDraggableImage,
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
