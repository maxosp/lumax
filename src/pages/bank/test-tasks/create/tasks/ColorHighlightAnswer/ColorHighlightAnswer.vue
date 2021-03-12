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
      <Wysiwyg :value="$containing" @input="setContaining" />
    </div>
    <div class="field">
      <span class="label">Аудиофайлы</span>
      <AudioFiles
        :audio-files="$audioFiles"
        @change-files="setAudioFiles"
        @upload-files="uploadAudioFiles"
      />
    </div>
    <div class='field'>
      <CorrectAnswerForm />
    </div>
    <div class='field'>
      <span class='label'>Образец ответа</span>
      <Wysiwyg :value="$answerExample" @input="setAnswerExample" />
    </div>
    <div class='field'>
      <LanguagesDropdown :value="$language" @click="setLanguage" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BaseTextarea from '@/ui/input/BaseTextarea.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import AudioFiles from '@/pages/bank/test-tasks/create/parts/audio-files/AudioFiles.vue'
import LanguagesDropdown from '@/pages/bank/test-tasks/create/parts/languages-dropdown/LanguagesDropdown.vue'
import CorrectAnswerForm from '@/pages/bank/test-tasks/create/tasks/ColorHighlightAnswer/parts/CorrectAnswerForm.vue'
import {
  $wording,
  setWording,
  $containing,
  setContaining,
  $isAudioUploadLoading,
  $audioFiles,
  setAudioFiles,
  uploadAudioFiles,
  $answerExample,
  setAnswerExample,
  $language,
  setLanguage,
} from '@/pages/bank/test-tasks/create/tasks/ColorHighlightAnswer/color-highlight-answer.model'

export default Vue.extend({
  name: 'ColorHighlightAnswer',
  components: {
    BaseTextarea,
    Wysiwyg,
    AudioFiles,
    LanguagesDropdown,
    CorrectAnswerForm,
  },
  effector: {
    $wording,
    $containing,
    $isAudioUploadLoading,
    $audioFiles,
    $answerExample,
    $language,
  },
  methods: {
    setWording,
    setContaining,
    setAudioFiles,
    uploadAudioFiles,
    setAnswerExample,
    setLanguage,
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
</style>
