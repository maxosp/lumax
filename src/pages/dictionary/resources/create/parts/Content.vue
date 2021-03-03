<template>
  <Card class="content">
    <div class="contents">
      <div class="left">
        <ThemeDropdown :class="{'--error': $themeError}" />
        <TypeDropdown :class="{'--error': $typeError}" />
        <FormInput
          :value="$videoLink"
          label="Ссылка"
          placeholder="Вставьте вашу ссылку"
          :max-length="200"
          :class="{'--error': $videoLinkError}"
          class="input"
          clear-btn
          @clear="resetVideoLink"
          @input="videoLinkChanged"
        />
        <FileUploadBlock />
        <div class='field'>
          <span class='label'>Описание</span>
          <Wysiwyg
            :value="$resourceDescription"
            placeholder="Введите текст"
            @input="resourceDescriptionChanged"
          />
        </div>
      </div>
      <div class="right">
        <SubjectDropdown :class="{'--error': $subjectError}" />
        <ClassDropdown :class="{'--error': $classError}" />
      </div>
    </div>
  </Card>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '@/ui/card/Card.vue'
import FormInput from '@/ui/input/FormInput.vue'
import ThemeDropdown from '@/pages/dictionary/resources/create/parts/theme/ThemeDropdown.vue'
import TypeDropdown from '@/pages/dictionary/resources/create/parts/type/TypeDropdown.vue'
import SubjectDropdown from '@/pages/dictionary/resources/create/parts/subjects/SubjectDropdown.vue'
import ClassDropdown from '@/pages/dictionary/resources/create/parts/class/ClassDropdown.vue'
import FileUploadBlock from '@/pages/dictionary/resources/create/parts/file-upload/FileUploadBlock.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import {
  $themeError,
  $subjectError,
  $classError,
  $typeError,
  $resourceDescription,
  resourceDescriptionChanged,
  $videoLink,
  videoLinkChanged,
  resetVideoLink,
  $videoLinkError,
} from '@/pages/dictionary/resources/create/resource-creation-page.model'

export default Vue.extend({
  components: {
    Card,
    FormInput,
    TypeDropdown,
    ThemeDropdown,
    SubjectDropdown,
    ClassDropdown,
    Wysiwyg,
    FileUploadBlock,
  },
  effector: {
    $themeError,
    $subjectError,
    $classError,
    $typeError,
    $resourceDescription,
    $videoLink,
    $videoLinkError,
  },
  methods: {
    resourceDescriptionChanged,
    videoLinkChanged,
    resetVideoLink,
  },
})
</script>

<style scoped>
.contents {
  display: contents;
}
.content {
  width: 100%;
  height: fit-content;
  padding: 30px;
  padding-bottom: 140px;
  box-sizing: border-box;
  margin-top: 20px;
  & ::v-deep .content {
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
  }
}
.left {
  width: 630px;
  .input {
    margin-bottom: 20px;
  }
}
.field {
  .label {
    display: block;
    font-weight: 600;
    margin-bottom: 7px;
  }
}
.right {
  width: 320px;
  .input:not(:last-child) {
    margin-bottom: 20px;
  }
}
.--error ::v-deep .inner-input {
  border: 2px solid var(--c-red-0) !important;
}
@media screen and (max-width: 1340px) {
  .content ::v-deep .content {
    justify-content: flex-start;
    overflow-x: scroll;
    overflow-y: hidden;
    box-sizing: border-box;
    padding-bottom: 30px;
  }
  .left {
    margin-right: 30px;
    min-width: 630px;
  }
  .right {
    min-width: 320px;
  }
}
</style>
