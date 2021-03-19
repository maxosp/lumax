<template>
  <label class="file-picker" @click.stop="">
    <input
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
    change(event: HTMLInputElement) {
      const uploader = this.$refs.uploader as HTMLInputElement
      const files = uploader.files as ArrayLike<File>
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
  },
})
</script>

<style scoped>
.file-picker {
  position: relative;
  width: 100%;
}
.file-picker-input {
  position: absolute;
  z-index: -1;
  visibility: hidden;
}
</style>
