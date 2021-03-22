<template>
  <div class="audio-files-container">
    <AudioFileInput
      @change="uploadAudioFiles"
    />
    <div class='files-container'>
      <div
        v-for="audio in $audioFiles"
        :key="audio.id"
        class="audio-file"
      >
        <div class="main">
          <div class="field play-image">
            <Icon
              type="play-filled"
              class="play-icon"
              size="10"
            />
          </div>
          <BaseInput
            :value="audio.file_name"
            class="field name-input"
            v-on="{
              ...$listeners,
              input: (value) => handleNameChange({ id: audio.id, value }),
            }"
          />
          <BaseSwitch
            class="field"
            :checked="audio.isLimited"
            @change="(value) => handleIsLimitedChange({ id: audio.id, value })"
          >
            <p>Не ограничивать</p>
          </BaseSwitch>
          <BaseInput
            v-if="audio.isLimited"
            :value="audio.limit"
            class="field limit-input"
            type="number"
            v-on="{
              ...$listeners,
              input: (value) => handleLimitChange({ id: audio.id, value }),
            }"
          />
        </div>
        <div class="close">
          <Icon
            class="close-icon"
            type="close"
            size="8"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseInput from '@/ui/input/BaseInput.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import AudioFileInput from '@/ui/audio-file-input/AudioFileInput.vue'

import {
  $audioFiles,
  setAudioFiles,
  uploadAudioFiles,
} from '@/pages/bank/test-tasks/create/tasks/multiple-short-closed-answer/multiple-short-closed-answer.model'

export default Vue.extend({
  name: 'AudioFiles',
  components: {
    Icon,
    BaseInput,
    BaseSwitch,
    AudioFileInput,
  },
  props: {
    files: { type: Array },
  },
  effector: {
    $audioFiles,
  },
  methods: {
    uploadAudioFiles,
    handleNameChange({ id, value }) {
      const files = this.$audioFiles.map((file) =>
        file.id === id ? { ...file, file_name: value } : file
      )
      setAudioFiles(files)
    },
    handleIsLimitedChange({ id, value }) {
      const files = this.$audioFiles.map((file) =>
        file.id === id ? { ...file, isLimited: value } : file
      )
      setAudioFiles(files)
    },
    handleLimitChange({ id, value }) {
      const files = this.$audioFiles.map((file) =>
        file.id === id ? { ...file, limit: value } : file
      )
      setAudioFiles(files)
    },
  },
})
</script>

<style scoped>
.files-container {
  display: flex;
  flex-direction: column;
}
.audio-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 530px;
}
.main {
  display: flex;
  align-items: center;
}
.field {
  margin-right: 20px;
}
.play-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: #fff;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
}
.play-icon {
  fill: var(--c-yellow-1);
}
.close-icon {
  margin-top: 18px;
  fill: var(--c-grey-3);
}
.name-input,
.limit-input {
  padding: 8px 15px;
  background: #fdfdfd;
  border: 1px solid #d5dae1;
  box-sizing: border-box;
  border-radius: 5px;
  max-width: 200px;
}
.limit-input {
  max-width: 60px;

  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
}
</style>
