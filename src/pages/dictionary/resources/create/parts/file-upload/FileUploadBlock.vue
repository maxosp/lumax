<template>
  <div class="file-upload">
    <div class="left">
      <label v-if="!$fileData">
        <span class="label" @click.prevent>
          Загрузите файл
        </span>
        <input
          id="fileInput"
          ref="fileInput"
          type="file"
          name="file"
          @change="handleFileUpload"
        >
        <BaseButton
          class='btn'
          small
          @click="handleClick"
        >
          Загрузить файл
        </BaseButton>
      </label>
      <div
        v-else
        class="file-wrapper"
      >
        <div class="ext">
          {{ fileExtenstion }}
        </div>
        <span> {{ formatName }} </span>
      </div>
    </div>
    <div
      v-if="$fileData"
      class="right"
    >
      <BaseButton
        class='btn'
        small
      >
        Заменить файл
      </BaseButton>
      <BaseButton
        class='btn'
        border-without-bg
        small
        @click="deleteMEdia($fileData.id)"
      >
        Удалить файл
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  uploadFile,
  $fileData,
  deleteMedia,
} from '@/pages/dictionary/resources/create/parts/file-upload/file-upload.model'

export default Vue.extend({
  components: {
    BaseButton,
  },
  effector: {
    $fileData,
  },
  computed: {
    formatName() {
      // @ts-ignore
      return this.$fileData.name.slice(this.$fileData.name.lastIndexOf('/') + 1)
    },
    fileExtenstion() {
      // @ts-ignore
      return this.$fileData.name.slice(this.$fileData.name.lastIndexOf('.') + 1)
    },
  },
  methods: {
    uploadFile,
    deleteMedia,
    handleClick() {
      document.getElementById('fileInput')!.click()
    },
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
  margin-bottom: 20px;
  input {
    display: none;
  }
  label {
    width: 100%;
    @mixin flex-row-central;
    justify-content: space-between;
  }
  .label {
    @mixin underline-text;
  }
  .right {
    @mixin flex-row-central;
    .btn:nth-child(2) {
      margin-left: 20px;
    }
  }
  .file-wrapper {
    @mixin flex-row-central;
    .ext {
      width: 40px;
      height: 40px;
      box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.15);
      border-radius: 5px;
      @mixin flex-center;
      font-size: 10px;
      line-height: 14px;
      font-weight: 700;
      color: var(--c-blue-0);
      margin-right: 15px;
    }
  }
}
</style>
