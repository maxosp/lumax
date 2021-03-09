<template>
  <div class="file-upload">
    <div class="left">
      <label :class="{'--invisible': $fileData}">
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
      </label>
      <div
        v-if="$fileData"
        class="file-wrapper"
      >
        <div class="ext">
          {{ fileExtenstion }}
        </div>
        <span> {{ formatName }} </span>
      </div>
    </div>
    <div class="right">
      <BaseButton
        v-if="!$fileData"
        class='btn'
        small
        @click="imitInputClick"
      >
        Загрузить файл
      </BaseButton>
      <BaseButton
        v-if="$fileData"
        class='btn'
        small
        @click="replaceFile($fileData.id)"
      >
        Заменить файл
      </BaseButton>
      <BaseButton
        v-if="$fileData"
        class='btn'
        border-without-bg
        small
        @click="deleteMedia($fileData.id)"
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
import { deleteMediaFx } from '@/features/api/media/delete-media'

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
    imitInputClick() {
      document.getElementById('fileInput')!.click()
    },
    handleFileUpload() {
      const { fileInput } = this.$refs
      // @ts-ignore
      uploadFile(fileInput.files)
    },
    replaceFile(id: number) {
      deleteMediaFx(id)
      this.imitInputClick()
    },
  },
})
</script>

<style scoped>
.file-upload {
  margin-bottom: 20px;
  @mixin flex-row-central;
  justify-content: space-between;
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
.--invisible {
  visibility: hidden;
  height: 0;
}
</style>
