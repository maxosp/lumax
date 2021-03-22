<template>
  <div class='wysiwyg'>
    <Ckeditor
      :id="$props.editorId"
      :value="$props.value"
      :config="editorConfig"
      :editor-url="editorUrl"
      class="editor"
      @ready="onEditorReady"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Ckeditor from 'ckeditor4-vue'
import { wysiwygConfig, url, enableRules } from '@/ui/wysiwyg/constants'
import { $token } from '@/features/api/common/request'

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
  effector: {
    $token,
  },
  data() {
    return {
      editorUrl: url,
      editorConfig: { ...wysiwygConfig, editorplaceholder: this.placeholder },
    }
  },
  methods: {
    onEditorReady() {
      if (window.CKEDITOR.instances[`editor${this.$props.editorIndex}`]) {
        window.CKEDITOR.instances[`editor${this.$props.editorIndex}`].on(
          'fileUploadRequest',
          (event) => {
            const { xhr } = event.data.fileLoader
            const formData = new FormData()

            xhr.open('POST', event.data.fileLoader.uploadUrl, true)

            xhr.setRequestHeader('authorization', `Bearer ${this.$token}`)

            formData.append('file', event.data.fileLoader.file, event.data.fileLoader.fileName)
            formData.append('file_type', 'image')

            event.data.fileLoader.xhr.send(formData)

            event.stop()
          }
        )
        window.CKEDITOR.instances[`editor${this.$props.editorIndex}`].on(
          'fileUploadResponse',
          (event) => {
            event.stop()
            const { data } = event
            const jsonResponse = data.fileLoader.xhr.responseText
            const parsedResponse = JSON.parse(jsonResponse)

            if (!parsedResponse.file) {
              data.message = 'An error occurred during upload.'
              event.cancel()
            } else {
              data.url = parsedResponse.file
            }
          }
        )
      }
    },
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
