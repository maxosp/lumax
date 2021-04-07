<template>
  <div class='content'>
    <div class='base'>
      <div class='left'>
        <SubjectDropdown class="field" @setItem="setSubject" />
        <ClassDropdown class="field" @setItem="setClass" />
        <ThemesDropdown class="field" @setItem="setTheme" />
        <DifficultiesDropdown class="field" @setItem="setDifficulty" />
        <LabelsDropdown class="field" />
        <TaskTypesDropdown class="field" @setItem="setTaskType" />
        <component
          v-if="$taskType"
          :is="taskComponent"
        />
        <LanguagesDropdown
          class="field"
          :value="$language"
          @click="setLanguage"
        />
      </div>
      <div class='right'>
        <p class="text"> Количество </p>
        <div class="wrapper">
          <NumericInput :value="+$count" @input="setCount" />
          <BaseButton
            class="btn"
            big
            @click="duplicateAssignment"
          >
            Дублировать
          </BaseButton>
        </div>
        <BaseSwitch
          v-if="![ 'new', 'archive' ].includes($status)"
          class="switch field"
          :checked="$isArchive"
          @change="setIsArchive"
        >
          <p>Архив</p>
        </BaseSwitch>
        <BaseSwitch
          v-if="[ 'reserve', 'archive' ].includes($status)"
          class="switch field"
          :checked="$isPublished"
          @change="setIsPublished"
        >
          <p>Опубликовано</p>
        </BaseSwitch>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import NumericInput from '@/ui/input/NumericInput.vue'
import DifficultiesDropdown from '@/pages/bank/test-tasks/edit/parts/difficulties-dropdown/DifficultiesDropdown.vue'
import LabelsDropdown from '@/pages/bank/test-tasks/edit/parts/labels-dropdown/LabelsDropdown.vue'
import TaskTypesDropdown from '@/pages/common/dropdowns/bank/task-types-dropdown/TaskTypesDropdown.vue'
import SubjectDropdown from '@/pages/common/dropdowns/subject/SubjectsDropdown.vue'
import ClassDropdown from '@/pages/common/dropdowns/class/ClassesDropdown.vue'
import ThemesDropdown from '@/pages/common/dropdowns/themes-tree/ThemeDropdown.vue'
import LanguagesDropdown from '@/pages/bank/test-tasks/edit/parts/languages-dropdown/LanguagesDropdown.vue'
import {
  setSubject,
  setClass,
  setTheme,
  setDifficulty,
  $language,
  setLanguage,
  $count,
  setCount,
  $taskType,
  setTaskType,
  $status,
  setIsArchive,
  $isArchive,
  duplicateAssignment,
  $isPublished,
  setIsPublished,
} from '@/pages/bank/test-tasks/edit/task-edition-page.model'
import * as tasks from '@/pages/common/parts/tasks'
import { mapTaskTypeTo } from '@/pages/common/constants'

export default Vue.extend({
  name: 'TaskContent',
  components: {
    BaseSwitch,
    BaseButton,
    DifficultiesDropdown,
    LabelsDropdown,
    TaskTypesDropdown,
    SubjectDropdown,
    ClassDropdown,
    ThemesDropdown,
    NumericInput,
    LanguagesDropdown,
  },
  effector: {
    $count,
    $taskType,
    $language,
    $status,
    $isArchive,
    $isPublished,
  },
  computed: {
    taskComponent() {
      return tasks[mapTaskTypeTo[this.$taskType].componentName] || null
    },
  },
  methods: {
    setSubject,
    setClass,
    setTheme,
    setDifficulty,
    setCount,
    setTaskType,
    setLanguage,
    setIsArchive,
    setIsPublished,
    duplicateAssignment,
  },
})
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  padding: 30px;
  background-color: #fff;
  border-radius: 3px;
}
.base {
  display: flex;
  justify-content: space-between;
}
.left,
.right {
  display: flex;
  flex-direction: column;
}
.left {
  flex-basis: 60%;
}
.right {
  flex-basis: 30%;
}
.tasks-count {
  display: flex;
  align-items: center;
}
.field {
  margin-bottom: 20px;
}
.switch {
  display: flex;
  margin-top: 0px;
}
.wrapper {
  @mixin flex-row-central;
  margin-bottom: 20px;
  & ::v-deep .numeric-input-wrap {
    max-width: 190px;
    height: 46px;
    box-sizing: border-box;
    margin-right: 20px;
    .inner-input {
      width: 90%;
    }
  }
}
</style>
