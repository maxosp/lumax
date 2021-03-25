<template>
  <div class="text-answer-wysiwyg">
    <div class="header">
      <FormLabel>Текст</FormLabel>
      <div class="actions">
        <BaseButton class="add-image button" @click="addImage">+ изображение</BaseButton>
        <BaseButton class="button" @click="addText">+ текст</BaseButton>
      </div>
    </div>
    <Wysiwyg
      class="text-container"
      :value="$mainTemplate"
      @input="changeMainTemplate"
      @instance-ready="instanceReady"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import FormLabel from '@/ui/label/FormLabel.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import {
  $mainTemplate,
  changeMainTemplate,
  inputsCounter,
  $inputs,
  droppableImagesCounter,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-text-input-answer/form/moving-images-on-text-input-answer-form.model'

let editorInstance: any = null

export default Vue.extend({
  name: `TextAnswerWysiwyg`,
  components: {
    FormLabel,
    BaseButton,
    Wysiwyg,
  },
  effector: {
    $mainTemplate,
    $inputs,
  },
  methods: {
    changeMainTemplate,
    addImage() {
      editorInstance.execCommand('addImageDNDBlock')
    },
    addText() {
      editorInstance.execCommand('addTextDNDBlock')
    },
    instanceReady(editor: any) {
      editor.addCommand('addTextDNDBlock', {
        exec: () =>
          editor.insertHtml(`
            <input
              class="redactor-input field droppable"
              style="width: 100px; height: 20px;"
              type="text"
              placeholder="B${inputsCounter.next()}"
            >
          `),
      })
      editor.addCommand('addImageDNDBlock', {
        exec: () =>
          editor.insertHtml(`
            <input
              class="redactor-drop droppable"
              style="width: 30px; height: 30px;"
              type="text"
              placeholder="A${droppableImagesCounter.next()}"
            >
          `),
      })
      editorInstance = editor
    },
  },
})
</script>

<style scoped>
.text-answer-wysiwyg {
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.add-image {
  margin-right: 10px;
}

.actions {
  display: flex;
  align-items: center;
}

.button {
  padding: 3px 10px;
  font-size: 14px;
  font-weight: normal;
  height: auto;
}
</style>
