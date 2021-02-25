<template>
  <div class="right-column">
    <ColorsDropDown class="main-field" />
    <div class="field">
      <span class="label">Иконка предмета</span>
      <FileInput
        v-if="!$iconSubject.length"
        accept="image/*"
        placeholder="Перетащите иконку в поле или выберите из"
        @change="uploadIconSubject"
      />
      <div
        v-else
        class="image-essence"
        :style="{ backgroundImage: `url(${$iconSubject})` }"
      >
        <Icon
          class="close-icon"
          type="close"
          size="8"
          @click="resetIconSubjectId"
        />
      </div>
    </div>
    <div class="field">
      <span class="label">Загрузить картинку</span>
      <FileInput
        v-if="!$imageSubject.length"
        accept="image/*"
        placeholder="Перетащите картинку в поле или выберите из"
        @change="uploadImageSubject"
      />
      <div
        v-else
        class="image-essence"
        :style="{ backgroundImage: `url(${$imageSubject})` }"
      >
        <Icon
          class="close-icon"
          type="close"
          color="#fff"
          size="8"
          @click="resetImageSubjectId"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ColorsDropDown from '@/pages/subjects/create/parts/colors/ColorsDropdown.vue'
import {
  uploadIconSubject,
  uploadImageSubject,
  $iconSubject,
  $imageSubject,
  resetIconSubjectId,
  resetImageSubjectId,
  $imageSubjectId,
} from '@/pages/subjects/create/subjects-creation-page.model'
import FileInput from '@/ui/audio-file-input/AudioFileInput.vue'
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  components: { ColorsDropDown, FileInput, Icon },
  effector: {
    $iconSubject,
    $imageSubject,
    $imageSubjectId,
  },
  methods: {
    uploadIconSubject,
    uploadImageSubject,
    resetIconSubjectId,
    resetImageSubjectId,
  },
})
</script>

<style scoped>
.right-column {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  margin-left: auto;
}
.main-field {
  z-index: 15;
}
.field {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}
.label {
  color: #000;
  font-weight: 600;
  line-height: 17px;
  margin-bottom: 5px;
}

.image-essence {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 10;
  }
}
.close-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  z-index: 11;
  fill: #fff;
}
</style>