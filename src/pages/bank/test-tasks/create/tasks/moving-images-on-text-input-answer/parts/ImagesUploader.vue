<template>
  <div class="images-uploader">
    <FormLabel class="label">Перемещаемые изображения</FormLabel>
    <FileInput
      accept="image/*"
      placeholder="Перетащите изображение в поле или выберите из файлов"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FileInput from '@/ui/audio-file-input/AudioFileInput.vue'
import FormLabel from '@/ui/label/FormLabel.vue'

export default Vue.extend({
  name: `ImagesUploader`,
  components: {
    FileInput,
    FormLabel,
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
