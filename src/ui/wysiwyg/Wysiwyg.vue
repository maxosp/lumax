<template>
  <div class='wysiwyg'>
    <Ckeditor
      :id="$props.editorId"
      :value="$props.value"
      :config="editorConfig"
      :editor-url="editorUrl"
      class="editor"
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

      if (!editor) {
        alert('Editor did not instanced, try to reload page')
        return
      }

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
  & ::v-deep .editor {
    background: var(--c-grey-4);
    border-radius: 5px;
    border: 0px;
    .cke_top {
      padding: 5px 8px;
      box-sizing: border-box;
      .cke_toolbar {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-bottom: 5px;
        & > span {
          margin: 0;
          padding: 0;
          a {
            padding: 0;
            width: 24px;
            height: 20px;
            overflow: hidden;
            margin-right: 5px;
            span {
              display: flex;
              width: 24px;
              height: 20px;
              float: unset;
              margin-top: 2px;
              background-position-x: 5px !important;
            }
          }
          a.cke_button_on {
            background: var(--c-grey-16);
            box-shadow: inset 0px 1px 4px rgba(0, 0, 0, 0.25);
            border-radius: 5px;
            border: 0px;
          }
          a.cke_button_off:hover {
            padding: 0;
            border: 0px;
            background: transparent;
            cursor: pointer;
          }
        }
        .cke_combo__font,
        .cke_combo__fontsize,
        .cke_combo__format {
          width: fit-content;
          a {
            width: fit-content;
            & > span {
              cursor: pointer;
              width: fit-content;
              margin: 0;
              padding: 0;
            }
          }
        }
        a.cke_combo_button:hover {
          padding: 0;
          border: 0px;
          background: transparent;
          cursor: pointer;
          margin-left: 0;
        }
      }
    }
    .cke_contents {
      height: 98px !important;
    }
    .cke_bottom {
      display: none;
    }
  }
}
</style>
