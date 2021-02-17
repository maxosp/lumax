<template>
  <div class='wysiwyg'>
    <Ckeditor
      :value="$props.value"
      :config="editorConfig"
      :editor-url="editorUrl"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Ckeditor from 'ckeditor4-vue'
import { config, url } from '@/ui/wysiwyg/constants'

export default Vue.extend({
  name: 'Wysiwyg',
  components: {
    Ckeditor: Ckeditor.component,
  },
  props: {
    value: { type: String, required: true, default: '' },
  },
  data() {
    return {
      editorUrl: url,
      editorConfig: config,
    }
  },
})
</script>

<style scoped>
.wysiwyg {
  display: flex;
  flex-direction: column;
  background: var(--base-bg-color);
  border-radius: 5px;
  padding: 2px;
}
</style>