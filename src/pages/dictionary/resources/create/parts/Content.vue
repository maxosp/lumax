<template>
  <Card class="content">
    <div class="contents">
      <div class="left">
        <ThemeDropdown :class="{'--error': themeError}" />
        <TypeDropdown :class="{'--error': typeError }" />
        <FormInput
          v-if="$selectedType && $selectedType.name === 'link'"
          :value="$link"
          label="Ссылка"
          placeholder="Вставьте вашу ссылку"
          :max-length="200"
          :class="{'--error': linkError}"
          class="input"
          clear-btn
          @clear="resetLink"
          @input="linkChanged"
        />
        <FormInput
          v-if="$selectedType && $selectedType.name === 'video'"
          :value="$link"
          label="Ссылка на видео"
          placeholder="Вставьте вашу ссылку"
          :max-length="200"
          :class="{'--error': linkError}"
          class="input"
          clear-btn
          @clear="resetLink"
          @input="linkChanged"
        />
        <FileUploadBlock
          v-if="$selectedType && $selectedType.name === 'file'"
          :class="{'--error': fileError}"
        />
        <div class='field'>
          <span class='label'>Описание</span>
          <Wysiwyg
            :value="$resourceDescription"
            placeholder="Введите текст"
            :class="{'--error': descriptionError}"
            @input="resourceDescriptionChanged"
          />
        </div>
      </div>
      <div class="right">
        <SubjectDropdown />
        <ClassDropdown />
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
  $themeErrorModule,
  $typeErrorModule,
  $resourceDescription,
  resourceDescriptionChanged,
  $link,
  linkChanged,
  resetLink,
  $linkErrorModule,
  $fileErrorModule,
  $descriptionErrorModule,
} from '@/pages/dictionary/resources/create/resource-creation-page.model'
import { $selectedType } from '@/pages/dictionary/resources/create/parts/type/type-dropdown.model'

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
    themeError: $themeErrorModule.store.$error,
    typeError: $typeErrorModule.store.$error,
    descriptionError: $descriptionErrorModule.store.$error,
    linkError: $linkErrorModule.store.$error,
    fileError: $fileErrorModule.store.$error,
    $resourceDescription,
    $link,
    $selectedType,
  },
  methods: {
    resourceDescriptionChanged,
    linkChanged,
    resetLink,
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
.--error ::v-deep .inner-input,
.--error ::v-deep .cke_contents {
  border: 2px solid var(--c-red-0) !important;
}

.--error ::v-deep label .label {
  text-decoration-color: var(--c-red-0);
  color: var(--c-red-0);
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
