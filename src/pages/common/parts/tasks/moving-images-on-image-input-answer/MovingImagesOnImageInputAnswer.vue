<template>
  <div class="moving-images-image-input-answer">
    <div class='field'>
      <div class='wording-head'>
        <span class='label'>Формулировка</span>
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
    <MovingImagesOnImageInputAnswerForm class="form" />
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
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import AudioFiles from '@/pages/common/parts/audio-files/AudioFiles.vue'
import MovingImagesOnImageInputAnswerForm from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/form/MovingImagesOnImageInputAnswerForm.vue'
import { clearFields as clearAnswerForm } from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/form/moving-images-on-image-answer-form.model'
import {
  $wording,
  setWording,
  $containing,
  setContaining,
  $answerExample,
  setAnswerExample,
  clearFields,
} from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/moving-images-on-image-answer.model'
import {
  $isAudioUploadLoading,
  $audioFiles,
  setAudioFiles,
  uploadAudioFiles,
} from '@/pages/common/parts/audio-files/audio-files.model'

export default Vue.extend({
  name: 'MovingImagesOnImageInputAnswer',
  components: {
    MovingImagesOnImageInputAnswerForm,
    BaseTextarea,
    Wysiwyg,
    AudioFiles,
  },
  effector: {
    $wording,
    $containing,
    $isAudioUploadLoading,
    $audioFiles,
    $answerExample,
  },
  methods: {
    setWording,
    setContaining,
    setAudioFiles,
    uploadAudioFiles,
    setAnswerExample,
  },
  beforeDestroy() {
    clearAnswerForm()
    clearFields()
  },
})
</script>

<style scoped>
.moving-images-image-input-answer {
  display: flex;
  flex-direction: column;
}
.form {
  margin-bottom: 20px;
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
</style>
