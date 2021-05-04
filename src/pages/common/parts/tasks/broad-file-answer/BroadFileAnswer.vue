<template>
  <div class='short-closed-answer'>
    <div class='field'>
      <div class='wording-head'>
        <span class='label'>Формулировка</span>
        <span class='template'>Шаблон</span>
      </div>
      <BaseTextarea
        placeholder="Введите формулировку задания"
        :value="$wording"
        @input="setWording"
      />
    </div>
    <div class='field'>
      <span class='label'>Текстовые и иллюстративные составляющие задания</span>
      <Wysiwyg
        :value="$containing"
        placeholder="Введите текст или добавьте иллюстративные составляющие задания"
        @input="setContaining"
      />
    </div>
    <div class="field">
      <span class="label">Аудиофайлы</span>
      <AudioFiles
        :audio-files="$audioFiles"
        @change-files="setAudioFiles"
        @upload-files="uploadAudioFiles"
      />
    </div>
    <div class='field annotation-container'>
      <div class="left-border" />
      <BaseCheckbox
        class="checkbox"
        option="disable_broad_answer"
        :value="$disableBroadAnswer"
        @change="toggleBroadAnswerDisabling"
      >
        Отключить поле ввода развернутого ответа
      </BaseCheckbox>
      <BaseCheckbox
        class="checkbox"
        option="disable_file_attachment"
        :value="$disableFileAttachment"
        @change="toggleFileAttachmentDisabling"
      >
        Отключить прикрепление файлов
      </BaseCheckbox>
    </div>
    <div class='field'>
      <span class='label'>Образец ответа</span>
      <Wysiwyg
        :value="$answerExample"
        placeholder="Образец ответа"
        @input="setAnswerExample"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BaseTextarea from '@/ui/input/BaseTextarea.vue'
import BaseCheckbox from '@/ui/checkbox/BaseCheckbox.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import AudioFiles from '@/pages/common/parts/audio-files/AudioFiles.vue'
import {
  $wording,
  setWording,
  $containing,
  setContaining,
  $answerExample,
  setAnswerExample,
  $disableBroadAnswer,
  toggleBroadAnswerDisabling,
  $disableFileAttachment,
  toggleFileAttachmentDisabling,
  clearFields,
} from '@/pages/common/parts/tasks/broad-file-answer/broad-file-answer.model'
import {
  $isAudioUploadLoading,
  $audioFiles,
  setAudioFiles,
  uploadAudioFiles,
} from '@/pages/common/parts/audio-files/audio-files.model'

export default Vue.extend({
  name: 'BroadFileAnswer',
  components: {
    BaseTextarea,
    BaseCheckbox,
    Wysiwyg,
    AudioFiles,
  },
  effector: {
    $wording,
    $containing,
    $isAudioUploadLoading,
    $audioFiles,
    $answerExample,
    $disableBroadAnswer,
    $disableFileAttachment,
  },
  methods: {
    setWording,
    setContaining,
    setAudioFiles,
    uploadAudioFiles,
    setAnswerExample,
    toggleBroadAnswerDisabling,
    toggleFileAttachmentDisabling,
  },
  beforeDestroy() {
    clearFields()
  },
})
</script>

<style scoped>
.short-closed-answer {
  display: flex;
  flex-direction: column;
}
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.label {
  color: #000;
  font-weight: 600;
  line-height: 17px;
  margin-bottom: 5px;
}
.wording-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.template {
  cursor: pointer;
  color: var(--base-text-primary);
  line-height: 17px;
  @mixin underline-text;
}
.annotation-container {
  position: relative;
}
.annotation {
  color: var(--base-text-secondary);
}
.checkbox + .checkbox {
  margin-top: 20px;
}
.left-border {
  position: absolute;
  left: -30px;
  width: 4px;
  height: 100%;
  background-color: var(--c-yellow-1);
}
</style>
