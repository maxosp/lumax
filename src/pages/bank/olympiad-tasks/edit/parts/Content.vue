<template>
  <div class='content'>
    <div class='base'>
      <div class='left'>
        <SubjectDropdown class="field" @setItem="setSubject" />
        <ClassDropdown class="field" @setItem="setClass" />
        <ScoreDropdown class="field" @setItem="setScore" />
        <TagsDropdown class="field" />
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
      <div class="right">
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
import SubjectDropdown from '@/pages/common/dropdowns/subject/SubjectsDropdown.vue'
import ClassDropdown from '@/pages/common/dropdowns/class/ClassesDropdown.vue'
import ScoreDropdown from '@/pages/common/dropdowns/bank/olympiad-tasks/score-dropdown/ScoreDropdown.vue'
import TaskTypesDropdown from '@/pages/common/dropdowns/bank/task-types-dropdown/TaskTypesDropdown.vue'
import TagsDropdown from '@/pages/bank/olympiad-tasks/edit/parts/tags-dropdown/TagsDropdown.vue'
import AddHintsBlock from '@/pages/common/parts/tasks/parts/add-hints-block/AddHintsBlock.vue'
import ShowAnswerBlock from '@/pages/common/parts/tasks/parts/show-answer-block/ShowAnswerBlock.vue'
import LanguagesDropdown from '@/pages/bank/olympiad-tasks/edit/parts/languages-dropdown/LanguagesDropdown.vue'
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
} from '@/pages/bank/olympiad-tasks/edit/task-edition-page.model'
import * as tasks from '@/pages/common/parts/tasks/'
import { mapTaskTypeTo } from '@/pages/common/constants'
import {
  $isArchive,
  $isPublished,
  $status,
  setIsArchive,
  setIsPublished,
} from '@/pages/common/parts/status-controller/status.model'

export default Vue.extend({
  name: 'TaskContent',
  components: {
    BaseSwitch,
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
    setScore,
    setTaskType,
    setLanguage,
    showSolutionEnabledChanged,
    setSolutionText,
    setIsArchive,
    setIsPublished,
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
.right {
  flex-basis: 30%;
}
.field {
  margin-bottom: 20px;
}
</style>
