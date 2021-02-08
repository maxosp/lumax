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
          :class="{'--error': $themeTitleError}"
          class="input"
          clear-btn
          @clear="resetThemeTitle"
          @input="themeTitleChanged"
        />
        <PositionDropdown :class="{'--error': $positionError}" />
        <TeachingResources />
        <Prerequisites />
      </div>
      <div class="right">
        <SubjectDropdown :class="{'--error': $subjectError}" />
        <ClassDropdown :class="{'--error': $classError}" />
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
          :class="{'--error': $prerequisiteTitleError}"
          class="input"
          clear-btn
          @clear="resetPrerequisiteTitle"
          @input="prerequisiteTitleChanged"
        />
        <TeachingResources />
        <Themes />
      </div>
      <div class="right">
        <SubjectDropdown :class="{'--error': $subjectError}" />
      </div>
    </div>
  </Card>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '@/ui/card/Card.vue'
import FormInput from '@/ui/input/FormInput.vue'
import PositionDropdown from '@/pages/theme-creation/parts/position/PositionDropdown.vue'
import Prerequisites from '@/pages/theme-creation/parts/prerequisites/Prerequisites.vue'
import SubjectDropdown from '@/pages/theme-creation/parts/subjects/SubjectDropdown.vue'
import ClassDropdown from '@/pages/theme-creation/parts/class/ClassDropdown.vue'
import TeachingResources from '@/pages/theme-creation/parts/teaching-resources/TeachingResources.vue'
import Themes from '@/pages/theme-creation/parts/themes/Themes.vue'
import {
  $themeTitle,
  resetThemeTitle,
  themeTitleChanged,
  $themeTitleError,
  $prerequisiteTitle,
  $prerequisiteTitleError,
  resetPrerequisiteTitle,
  prerequisiteTitleChanged,
  $positionError,
  $subjectError,
  $classError,
  $isPrerequisite,
} from '@/pages/theme-creation/theme-creation-page.model'

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
    $themeTitleError,
    $prerequisiteTitle,
    $prerequisiteTitleError,
    $positionError,
    $subjectError,
    $classError,
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
</style>
