<template>
  <div class='wysiwyg'>
    <Ckeditor
      :id="$props.editorId"
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
import { config, url, enableRules } from '@/ui/wysiwyg/constants'

export default Vue.extend({
  name: 'Wysiwyg',
  components: {
    Ckeditor: Ckeditor.component,
  },
  props: {
    value: { type: String, required: true, default: '' },
    listenInsertion: { type: Boolean, required: false, default: false },
    editorId: { type: String, required: false },
    placeholder: { type: String, default: '' },
  },
  data() {
    return {
      editorUrl: url,
      editorConfig: { ...config, editorplaceholder: this.placeholder },
    }
  },
  methods: {
    handleInsert(event) {
      const editor = window.CKEDITOR.instances.editor2

      editor.focus()
      editor.insertHtml(event.detail)
    },
  },
  mounted() {
    window.CKEDITOR.on('instanceReady', enableRules)

    if (this.$props.listenInsertion) {
      const editor = document.querySelector(`#${this.$props.editorId}`)
      editor && editor.addEventListener('insert', this.handleInsert)
    }
  },
  berforeDestroy() {
    if (this.$props.listenInsertion) {
      const editor = document.querySelector(`#${this.$props.editorId}`)
      editor && editor.removeEventListener('insert', this.handleInsert)
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