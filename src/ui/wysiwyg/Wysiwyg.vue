<template>
  <div class='wysiwyg'>
    <Ckeditor
      :id="editorId"
      ref="ckeditor"
      :value="value"
      :config="editorConfig"
      :editor-url="editorUrl"
      class="editor"
      @ready="onEditorReady"
      @input="val => $emit('input', val)"
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
    listenSelection: { type: Boolean, required: false, default: false },
    editorId: { type: String, required: false },
    editorIndex: { type: Number, required: false, default: 2 },
    placeholder: { type: String, default: '' },
  },
  effector: {
    $token,
  },
  data() {
    return {
      editorUrl: url,
      editorConfig: { ...wysiwygConfig, editorplaceholder: this.value ? '' : this.placeholder },
      editorName: '',
    }
  },
  methods: {
    // getReadStream(mediaURL) {
    //   return fetch(mediaURL.trim()).then(({ body }) => body.getReader())
    // },
    // getCaptionFromURL(mediaURL) {
    //   const splittedURL = mediaURL.trim().split('/')
    //   return splittedURL[splittedURL.length - 1]
    // },
    // async transformStreamIntoFile({ url: mediaUrl, fileType }) {
    //   try {
    //     const streamReader = await this.getReadStream(mediaUrl)
    //     const streamBuffer = await streamReader.read().then(({ done, value }) => ({ done, value }))
    //     const file = new File(streamBuffer.value, this.getCaptionFromURL(mediaUrl), {
    //       type: fileType,
    //     })
    //     return file
    //   } catch (err) {
    //     console.error('ERRORED_WHILE_STREAM_TRANSFORM')
    //     console.log(err)
    //   }
    // },
    // parseForMedia(v) {
    //   const exp = /https?:\/\/(.*?)"/gi
    //   const expVideo = /(.mp4|.webm|.avi|.wmv|.mov)/gi
    //   const expImage = /(.jpeg|.jpg|.png)/gi
    //   let URLs = v.match(exp)

    //   let mediaObject = null

    //   if (URLs) {
    //     URLs = URLs.map((urlObj) => {
    //       if (urlObj.match(expVideo)) {
    //         mediaObject = {
    //           url: urlObj.slice(0, -1),
    //           tag: 'video',
    //           fileType: `video/${urlObj.match(expVideo)[0].replace('.', '')}`,
    //         }
    //       } else if (urlObj.match(expImage)) {
    //         mediaObject = {
    //           url: urlObj.slice(0, -1),
    //           tag: 'img',
    //           fileType: `image/${urlObj.match(expImage)[0].replace('.', '')}`,
    //         }
    //       }
    //       return mediaObject
    //     })
    //     return URLs
    //   }
    // },
    // async uploadPictureAndEmit(v) {
    // const mediaObject = this.parseForMedia(v)
    // if (mediaObject) {
    //   mediaObject.map(async (media) => {
    //     try {
    //       const file = await this.transformStreamIntoFile(media)
    //       const fd = new FormData()

    //       fd.append('file', file, file.name)
    //       fd.append('file_type', media.tag)

    //       await fetch(`${config.BACKEND_URL}/api/media-app/media/upload/`, {
    //         method: 'POST',
    //         headers: {
    //           Authorization: `Bearer ${this.$token}`,
    //         },
    //         body: fd,
    //       }).then((r) => r.json())
    //     } catch (err) {
    //       console.error('ERORRED_WHILE_UPLOADING_PICTURE')
    //       console.log(err)
    //     }
    //     return media
    //   })
    // }
    // this.$emit('input', v)
    // },
    onEditorReady(editor) {
      this.editorName = editor.name
      const editable = editor.editable()

      editor.on('fileUploadRequest', (event) => {
        const { xhr } = event.data.fileLoader
        const formData = new FormData()

        xhr.open('POST', event.data.fileLoader.uploadUrl, true)

        xhr.setRequestHeader('authorization', `Bearer ${this.$token}`)

        formData.append('file', event.data.fileLoader.file, event.data.fileLoader.fileName)
        formData.append('file_type', 'image')

        event.data.fileLoader.xhr.send(formData)
        event.stop()
      })
      editor.on('fileUploadResponse', (event) => {
        event.stop()
        const { data } = event
        const jsonResponse = data.fileLoader.xhr.responseText
        const parsedResponse = JSON.parse(jsonResponse)

        if (!parsedResponse.file) {
          data.message = 'Во время загрузки изображения произошла ошибка'
          event.cancel()
        } else {
          data.url = parsedResponse.file
        }
      })
      editor.on('paste', (event) => {
        const checkString = event.editor.container.$.innerText
          .split('\n')
          .splice(0, 10)
          .filter((el) => !!el.trim().length)
        const incomingString = event.data.dataValue.split(' ')
        if (incomingString.some((el) => checkString.includes(el))) event.cancel()
      })
      if (editor.dataProcessor.dataFilter) {
        editor.dataProcessor.dataFilter.addRules({
          elements: {
            img: (element) => {
              element.attributes.style = 'width: 200px; height: 200px'
            },
          },
        })
      }
      if (this.listenSelection) {
        editable.attachListener(editable, 'mouseup', (event) => {
          const range = editor.getSelectedRanges()
          const isRange = range[0].endOffset - range[0].startOffset > 0
          if (isRange) {
            // parent node and their bounding for setting right position if mouseout happened far from elem
            const parentElementPosition = editor
              .getSelection()
              .getNative()
              .anchorNode.parentNode.getBoundingClientRect()
            // event for position
            const mouseEvent = event.data.$

            if (!parentElementPosition && !mouseEvent) return

            this.$emit('text-selected', { parentElementPosition, mouseEvent, editor })
          }
        })
      }

      editor.on('beforeDestroy', () => {
        editable.clearListeners()
        editor.removeAllListeners()
      })

      this.$emit('instance-ready', editor)
    },
    handleInsert(event) {
      const editor = window.CKEDITOR.instances[this.editorName]
      if (!editor) {
        alert('Editor did not instanced, try to reload page')
        return
      }
      editor.focus()
      editor.insertHtml(event.detail)
    },
  },
  mounted() {
    const editor = document.querySelector(`#${this.$props.editorId}`)
    window.CKEDITOR.on('instanceReady', enableRules)

    window.CKEDITOR.on('instanceReady', () => {
      if (this.$props.listenInsertion) {
        editor && editor.addEventListener('insert', this.handleInsert)
      }
    })
  },
  beforeDestroy() {
    const editor = document.querySelector(`#${this.$props.editorId}`)

    if (this.$props.listenInsertion) {
      editor && editor.removeEventListener('insert', this.handleInsert)
    }
  },
})
</script>

<style scoped>
.wysiwyg {
  max-width: 936px;
}
::v-deep .editor {
  table {
    table-layout: fixed;
  }
  th,
  tr,
  td {
    border: 1px solid black;
  }
  li {
    margin-left: 20px;
    padding-left: 5px;
    padding-top: 5px;
  }
  ol > li {
    list-style-type: decimal;
  }
  ul > li {
    list-style-type: disc;
  }
  .cke_chrome {
    background: #edeef0;
    border: none;
    border-radius: 5px;
    padding: 2px;
  }
  .cke_bottom {
    display: none;
  }
  .cke_top {
    padding: 5px 8px;
    background: #fff;
    border-radius: 5px 5px 0 0;
  }
  .cke_contents {
    margin-bottom: 3px;
    padding: 5px;
    padding-top: 1em;
    background-color: transparent;
    border: none;
  }
  .cke_wysiwyg_div {
    margin-top: 0;
    background: transparent;
  }
  .cke_wysiwyg_div::before {
    opacity: 1;
    margin-top: 0;
  }
  .cke_toolgroup {
    border: 0;
    background-color: transparent;
  }
  .cke_button {
    margin-right: 15px;
  }
  .cke_button_icon {
    opacity: 1;
  }
  .cke_button_on {
    background-color: var(--c-grey-16);
    box-shadow: inset 0px 1px 4px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    border: 0px;
  }
  .cke_button_off:hover {
    border: 0px;
    background-color: transparent;
    cursor: pointer;
  }
  .cke_source {
    background-color: transparent;
  }
}
</style>
