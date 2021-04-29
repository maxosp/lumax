<template>
  <label
    class="file-picker"
    @dragover="preventDefault"
    @dragenter="preventDefault"
    @drop="dropHandle"
  >
    <input
      id="file-picker"
      ref="uploader"
      type="file"
      :accept="accept"
      :multiple="multiple"
      class="file-picker-input"
      @change="change"
    >
    <slot />
  </label>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: `FilePicker`,
  props: {
    accept: {
      type: String,
      default: '*/*',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    change(event: HTMLInputElement | FileList) {
      const uploader = this.$refs.uploader as HTMLInputElement
      let files = null
      if (event instanceof FileList) {
        files = event
      } else {
        files = uploader.files as ArrayLike<File>
      }
      const filesArray = Array.from(files)

      this.$emit('change', {
        getFormData: (key: string, otherKeys?: any) => {
          const data = new FormData()
          filesArray.forEach((file) => {
            data.append(key, file)
          })
          if (otherKeys) {
            Object.keys(otherKeys).forEach((anotherKey) =>
              data.append(anotherKey, otherKeys[anotherKey])
            )
          }
          return data
        },
        files,
        filesArray,
        nativeEvent: event,
      })

      uploader.value = ''
    },
    dropHandle(event: DragEvent) {
      this.change(event.dataTransfer!.files)
      event.preventDefault()
    },
    preventDefault(event: MouseEvent) {
      event.preventDefault()
    },
  },
})
</script>

<style scoped>
.file-picker {
  position: relative;
  width: 100%;
  text-align: center;
}
.file-picker-input {
  position: absolute;
  z-index: -1;
  visibility: hidden;
}
</style>
