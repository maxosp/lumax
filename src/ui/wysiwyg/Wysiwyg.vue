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
    listenRightClick: { type: Boolean, required: false, default: false },
    editorId: { type: String, required: false },
    editorIndex: { type: Number, required: false, default: 1 },
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
      const editor = window.CKEDITOR.instances[`editor${this.$props.editorIndex}`]

      if (!editor) {
        alert('Editor did not instanced, try to reload page')
        return
      }

      editor.focus()
      editor.insertHtml(event.detail)
    },
    handleRightClick(el) {
      this.$emit('right-click', el.$)
    },
  },
  mounted() {
    window.CKEDITOR.on('instanceReady', enableRules)
    const editor = document.querySelector(`#${this.$props.editorId}`)

    document.addEventListener('contextmenu', this.handleRightClick)

    if (this.$props.listenRightClick) {
      window.CKEDITOR.on('instanceReady', () => {
        const currentEditor = window.CKEDITOR.instances[`editor${this.$props.editorIndex}`]
        currentEditor.contextMenu.addListener((el) => {
          currentEditor.contextMenu.removeAll()
          this.handleRightClick(el)
        })
      })
    }

    if (this.$props.listenInsertion) {
      editor && editor.addEventListener('insert', this.handleInsert)
    }
  },
  berforeDestroy() {
    const editor = document.querySelector(`#${this.$props.editorId}`)

    if (this.$props.listenInsertion) {
      editor && editor.removeEventListener('insert', this.handleInsert)
    }

    if (this.$props.listenRightClick) {
      const editorArea = editor && editor.querySelector('.cke_contents')
      editorArea && editorArea.removeEventListener('contextmenu', this.handleRightClick)
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