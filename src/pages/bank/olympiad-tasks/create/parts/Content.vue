<template>
  <div class='content'>
    <div class='base'>
      <div class='left'>
        <SubjectDropdown class="field" @setItem="setSubject" />
        <ClassDropdown class="field" @setItem="setClass" />
        <ScoreDropdown class="field" @setItem="setScore" />
        <TagsDropdown class="field" :disabled="!$canSetTags" />
        <TaskTypesDropdown class="field" @setItem="setTaskType" />
        <component
          v-if="$taskType"
          :is="taskComponent"
        />
        <div
          v-if="$taskType"
          class="field"
        >
          <AddHintsBlock />
        </div>
        <div
          v-if="$taskType"
          class="field"
        >
          <ShowAnswerBlock
            :show-solution-enabled="$showSolutionEnabled"
            :solution-text="$solutionText"
            @showSolutionEnabledChanged="showSolutionEnabledChanged"
            @set-solution="setSolutionText"
          />
        </div>
        <LanguagesDropdown
          class="field"
          :value="$language"
          @click="setLanguage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import SubjectDropdown from '@/pages/common/dropdowns/subject/SubjectsDropdown.vue'
import ClassDropdown from '@/pages/common/dropdowns/class/ClassesDropdown.vue'
import ScoreDropdown from '@/pages/common/dropdowns/bank/olympiad-tasks/score-dropdown/ScoreDropdown.vue'
import TaskTypesDropdown from '@/pages/common/dropdowns/bank/task-types-dropdown/TaskTypesDropdown.vue'
import TagsDropdown from '@/pages/bank/olympiad-tasks/create/parts/tags-dropdown/TagsDropdown.vue'
import AddHintsBlock from '@/pages/common/parts/tasks/parts/add-hints-block/AddHintsBlock.vue'
import ShowAnswerBlock from '@/pages/common/parts/tasks/parts/show-answer-block/ShowAnswerBlock.vue'
import LanguagesDropdown from '@/pages/bank/olympiad-tasks/create/parts/languages-dropdown/LanguagesDropdown.vue'
import {
  setSubject,
  setClass,
  setScore,
  $taskType,
  setTaskType,
  $language,
  setLanguage,
  $showSolutionEnabled,
  showSolutionEnabledChanged,
  $solutionText,
  setSolutionText,
  $canSetTags,
} from '@/pages/bank/olympiad-tasks/create/task-creation-page.model'
import * as tasks from '@/pages/common/parts/tasks/'
import { mapTaskTypeTo } from '@/pages/common/constants'

export default Vue.extend({
  name: 'TaskContent',
  components: {
    SubjectDropdown,
    ClassDropdown,
    ScoreDropdown,
    TaskTypesDropdown,
    TagsDropdown,
    AddHintsBlock,
    ShowAnswerBlock,
    LanguagesDropdown,
  },
  effector: {
    $taskType,
    $language,
    $showSolutionEnabled,
    $solutionText,
    $canSetTags,
  },
  computed: {
    taskComponent() {
      return tasks[mapTaskTypeTo[this.$taskType].componentName] || null
    },
  },
  methods: {
    setSubject,
    setClass,
    setScore,
    setTaskType,
    setLanguage,
    showSolutionEnabledChanged,
    setSolutionText,
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
.left {
  display: flex;
  flex-direction: column;
  flex-basis: 60%;
}
.field {
  margin-bottom: 20px;
}
</style>
