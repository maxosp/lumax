<template>
  <div class="left-column">
    <FormInput
      :value="$subjectTitle"
      label="Название предмета"
      placeholder="Введите название предмета"
      :max-length="200"
      :class="{ '--error': $subjectTitleError }"
      class="input"
      clear-btn
      @clear="resetSubjectTitle"
      @input="subjectTitleChanged"
    />
    <div class='field'>
      <span class='label'>Описание</span>
      <Wysiwyg :value="$subjectDescription" @input="subjectDescriptionChanged" />
    </div>
    <div class='field'>
      <span class='label'>Краткая полезная информаиция</span>
      <Wysiwyg :value="$useFulInfo" @input="useFulInfoChanged" />
    </div>
    <div class='field'>
      <span class='label'>Полезная информаиция</span>
      <Wysiwyg :value="$shortUsefulInfo" @input="shortUsefulInfoChanged" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FormInput from '@/ui/input/FormInput.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import {
  $subjectTitle,
  $subjectTitleError,
  resetSubjectTitle,
  subjectTitleChanged,
  $subjectDescription,
  subjectDescriptionChanged,
  $useFulInfo,
  useFulInfoChanged,
  $shortUsefulInfo,
  shortUsefulInfoChanged,
} from '@/pages/dictionary/subjects/common/create-edit.model'

export default Vue.extend({
  components: { FormInput, Wysiwyg },
  effector: {
    $subjectTitle,
    $subjectTitleError,
    $subjectDescription,
    $useFulInfo,
    $shortUsefulInfo,
  },
  methods: {
    resetSubjectTitle,
    subjectTitleChanged,
    subjectDescriptionChanged,
    useFulInfoChanged,
    shortUsefulInfoChanged,
  },
})
</script>

<style scoped>
.left-column {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 630px;
  margin-right: 30px;
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
.--error ::v-deep .inner-input {
  border: 2px solid var(--c-red-0) !important;
}
</style>