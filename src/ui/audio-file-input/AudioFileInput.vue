<template>
  <div class='audio-file-input'>
    <div ref="dropContainer" class="drop-container">
      <span>{{ placeholder }}&nbsp;
        <span ref="triggerText" class='trigger'>файлов</span>
      </span>

    </div>
    <input
      ref="fileInput"
      class="file-input"
      type="file"
      :accept="accept"
    >
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'AudioFileInput',
  props: {
    placeholder: {
      type: String,
      default: 'Перетащите аудиофайл в поле или выберите из',
    },
    accept: {
      type: String,
      default: 'audio/*',
    },
  },
  methods: {
    preventDefault(event) {
      event.preventDefault()
    },
    dropHandle(event) {
      this.$emit('change', event.dataTransfer.files)
      event.preventDefault()
    },
    inputHandle(event) {
      const { fileInput } = this.$refs
      this.$emit('change', fileInput.files)
      event.preventDefault()
    },
    handleClick(event) {
      event.preventDefault()
      const { fileInput } = this.$refs
      fileInput.click()
    },
  },
  mounted() {
    const { dropContainer, fileInput, triggerText } = this.$refs
    dropContainer.addEventListener('dragover', this.preventDefault)
    dropContainer.addEventListener('dragenter', this.preventDefault)
    dropContainer.addEventListener('drop', this.dropHandle)
    fileInput.addEventListener('change', this.inputHandle)
    triggerText.addEventListener('click', this.handleClick)
  },
  beforeDestroy() {
    const { dropContainer, fileInput, triggerText } = this.$refs
    dropContainer.removeEventListener('dragover', this.preventDefault)
    dropContainer.removeEventListener('dragenter', this.preventDefault)
    dropContainer.removeEventListener('drop', this.dropHandle)
    fileInput.removeEventListener('change', this.inputHandle)
    triggerText.removeEventListener('click', this.handleClick)
  },
})
</script>

<style scoped>
.audio-file-input {
  display: flex;
  flex-direction: column;
}
.drop-container {
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--c-grey-5);
  border: 1px dashed var(--c-grey-3);
  box-sizing: border-box;
  border-radius: 5px;
  line-height: 17px;
  color: var(--base-text-secondary);
  padding: 15px;
}
.trigger {
  cursor: pointer;
  @mixin underline-text;
  color: var(--base-text-primary);
}
.file-input {
  visibility: hidden;
  height: 10px;
}
</style>
