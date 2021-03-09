<template>
  <Card class="content">
    <div
      v-if="!$isPrerequisite"
      class="contents"
    >
      <div class="left">
        <FormInput
          :value="$themeTitle"
          label="Название темы"
          placeholder="Введите название темы"
          :max-length="200"
          :class="{'--error': themeTitleError}"
          class="input"
          clear-btn
          @clear="resetThemeTitle"
          @input="themeTitleChanged"
        />
        <PositionDropdown :class="{'--error': positionError}" />
        <TeachingResources />
        <Prerequisites />
      </div>
      <div class="right">
        <SubjectDropdown :class="{'--error': subjectError}" />
        <ClassDropdown :class="{'--error': classError}" />
      </div>
    </div>
    <div
      v-else
      class="contents"
    >
      <div class="left">
        <FormInput
          :value="$prerequisiteTitle"
          label="Название пререквизита"
          placeholder="Введите название пререквизита"
          :max-length="100"
          :class="{'--error': prerequisiteTitleError}"
          class="input"
          clear-btn
          @clear="resetPrerequisiteTitle"
          @input="prerequisiteTitleChanged"
        />
        <TeachingResources />
        <Themes />
      </div>
      <div class="right">
        <SubjectDropdown :class="{'--error': subjectError}" />
      </div>
    </div>
  </Card>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '@/ui/card/Card.vue'
import FormInput from '@/ui/input/FormInput.vue'
import PositionDropdown from '@/pages/dictionary/themes/edit/parts/position/PositionDropdown.vue'
import Prerequisites from '@/pages/dictionary/themes/edit/parts/prerequisites/Prerequisites.vue'
import SubjectDropdown from '@/pages/dictionary/themes/edit/parts/subjects/SubjectDropdown.vue'
import ClassDropdown from '@/pages/dictionary/themes/edit/parts/class/ClassDropdown.vue'
import TeachingResources from '@/pages/dictionary/themes/edit/parts/teaching-resources/TeachingResources.vue'
import Themes from '@/pages/dictionary/themes/edit/parts/themes/Themes.vue'
import {
  $themeTitle,
  resetThemeTitle,
  themeTitleChanged,
  $themeTitleErrorModule,
  $prerequisiteTitle,
  $prerequisiteTitleErrorModule,
  resetPrerequisiteTitle,
  prerequisiteTitleChanged,
  $positionErrorModule,
  $subjectErrorModule,
  $classErrorModule,
  $isPrerequisite,
} from '@/pages/dictionary/themes/edit/theme-edition-page.model'

export default Vue.extend({
  components: {
    Card,
    FormInput,
    PositionDropdown,
    Prerequisites,
    SubjectDropdown,
    ClassDropdown,
    TeachingResources,
    Themes,
  },
  effector: {
    $themeTitle,
    $prerequisiteTitle,
    themeTitleError: $themeTitleErrorModule.store.$error,
    prerequisiteTitleError: $prerequisiteTitleErrorModule.store.$error,
    positionError: $positionErrorModule.store.$error,
    subjectError: $subjectErrorModule.store.$error,
    classError: $classErrorModule.store.$error,
    $isPrerequisite,
  },
  methods: {
    resetThemeTitle,
    themeTitleChanged,
    resetPrerequisiteTitle,
    prerequisiteTitleChanged,
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
