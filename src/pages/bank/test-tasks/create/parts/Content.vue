<template>
  <div class='content'>
    <div class='base'>
      <div class='left'>
        <SubjectDropdown class="field" @setItem="setSubject" />
        <ClassDropdown class="field" @setItem="setClass" />
        <ThemesDropdown
          class="field"
          is-disabled
          @setItem="setTheme"
        />
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
        <BaseSwitch
          class="switch field"
          :checked="$needDuplicate"
          @change="toggleNeedDuplicate"
        >
          <p>Дублировать</p>
        </BaseSwitch>
        <NumericInput :value="$count" @input="setCount" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import NumericInput from '@/ui/input/NumericInput.vue'
import DifficultiesDropdown from '@/pages/bank/test-tasks/create/parts/difficulties-dropdown/DifficultiesDropdown.vue'
import LabelsDropdown from '@/pages/bank/test-tasks/create/parts/labels-dropdown/LabelsDropdown.vue'
import TaskTypesDropdown from '@/pages/common/dropdowns/bank/task-types-dropdown/TaskTypesDropdown.vue'
import SubjectDropdown from '@/pages/common/dropdowns/subject/SubjectsDropdown.vue'
import ClassDropdown from '@/pages/common/dropdowns/class/ClassesDropdown.vue'
import ThemesDropdown from '@/pages/common/dropdowns/themes-tree/ThemeDropdown.vue'
import LanguagesDropdown from '@/pages/bank/olympiad-tasks/create/parts/languages-dropdown/LanguagesDropdown.vue'
import {
  setSubject,
  setClass,
  setTheme,
  setDifficulty,
  $language,
  setLanguage,
  $needDuplicate,
  toggleNeedDuplicate,
  $count,
  setCount,
  $taskType,
  setTaskType,
} from '@/pages/bank/test-tasks/create/task-creation-page.model'
import * as tasks from '@/pages/common/parts/tasks'
import { mapTaskTypeTo } from '@/pages/common/constants'

export default Vue.extend({
  name: 'TaskContent',
  components: {
    BaseSwitch,
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
    $needDuplicate,
    $count,
    $taskType,
    $language,
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
    toggleNeedDuplicate,
    setCount,
    setTaskType,
    setLanguage,
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
</style>
