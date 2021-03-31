<template>
  <div class="audio-files-container">
    <AudioFileInput
      @change="$emit('upload-files', $event)"
    />
    <div v-if="$props.audioFiles.length" class='files-container'>
      <div
        v-for="audio in $props.audioFiles"
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
            v-tooltip.right="tooltipOptions"
            v-if="!audio.isLimited"
            :value="audio.limit"
            class="field limit-input"
            type="number"
            min="0"
            v-on="{
              ...$listeners,
              input: (value) => handleLimitChange({ id: audio.id, value }),
            }"
          />
        </div>
        <div class="field duration">{{ getReadableDuration(audio.duration_sec) }}</div>
        <div class="close" @click="handleRemoveAudio({ id: audio.id })">
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
import { getReadableDuration } from '@/pages/common/parts/audio-files/utils'

export default Vue.extend({
  name: 'AudioFiles',
  components: {
    Icon,
    BaseInput,
    BaseSwitch,
    AudioFileInput,
  },
  props: {
    audioFiles: { type: Array },
  },
  computed: {
    tooltipOptions() {
      return {
        content: 'Количество прослушиваний',
      }
    },
  },
  methods: {
    getReadableDuration,
    handleNameChange({ id, value }) {
      const newFiles = this.$props.audioFiles.map((file) =>
        file.id === id ? { ...file, file_name: value } : file
      )
      this.$emit('change-files', newFiles)
    },
    handleIsLimitedChange({ id, value }) {
      const newFiles = this.$props.audioFiles.map((file) =>
        file.id === id ? { ...file, isLimited: value } : file
      )
      this.$emit('change-files', newFiles)
    },
    handleLimitChange({ id, value }) {
      const newFiles = this.$props.audioFiles.map((file) =>
        file.id === id ? { ...file, limit: value } : file
      )
      this.$emit('change-files', newFiles)
    },
    handleRemoveAudio({ id }) {
      const newFiles = this.$props.audioFiles.filter((file) => file.id !== id)
      this.$emit('change-files', newFiles)
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
.audio-file + .audio-file {
  margin-top: 10px;
}
.main {
  display: flex;
  align-items: center;
  flex-grow: 1;
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
.close {
  display: flex;
  align-items: center;
}
.close-icon {
  fill: var(--c-grey-3);
}
.name-input,
.limit-input {
  padding: 8px 15px;
  background: #fdfdfd;
  border: 1px solid #d5dae1;
  box-sizing: border-box;
  border-radius: 5px;
}

.name-input {
  flex-grow: 1;
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

.duration {
  color: var(--base-text-secondary);
}
</style>
