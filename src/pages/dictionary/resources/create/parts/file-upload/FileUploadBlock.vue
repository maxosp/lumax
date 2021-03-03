<template>
  <div class="file-upload">
    <div class="left">
      <label>
        <span class="label">
          Загрузите файл
        </span>
        <input
          ref="fileInput"
          type="file"
          name="file"
          @change="handleFileUpload"
        >
      </label>
    </div>
    <div class="right">
      btns
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { uploadFile } from '@/pages/dictionary/resources/create/parts/file-upload/file-upload.model'

export default Vue.extend({
  methods: {
    uploadFile,
    handleFileUpload() {
      const { fileInput } = this.$refs
      // @ts-ignore
      uploadFile(fileInput.files)
    },
  },
})
</script>

<style scoped>
.file-upload {
  outline: 1px solid lime;
}
</style>
