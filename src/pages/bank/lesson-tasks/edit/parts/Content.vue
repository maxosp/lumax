<template>
  <div class='content'>
    <div class='base'>
      <div class='left'>
        <PositionDropdown class="field" @setItem="setFolder" />
        <NumericInput
          class="field"
          :value="+$score"
          label="Баллы"
          placeholder="Введите количество баллов"
          @input="setScore"
        />
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
        <p class="text"> Количество</p>
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
import PositionDropdown from '@/pages/common/dropdowns/bank/lesson-tasks/position-dropdown/PositionDropdown.vue'
import TaskTypesDropdown from '@/pages/common/dropdowns/bank/task-types-dropdown/TaskTypesDropdown.vue'
import LanguagesDropdown from '@/pages/bank/lesson-tasks/edit/parts/languages-dropdown/LanguagesDropdown.vue'
import NumericInput from '@/ui/input/NumericInput.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import FormInput from '@/ui/input/FormInput.vue'
import {
  setFolder,
  setScore,
  $score,
  $taskType,
  setTaskType,
  $language,
  setLanguage,
  $count,
  setCount,
  duplicateAssignment,
} from '@/pages/bank/lesson-tasks/edit/task-edition-page.model'
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
    PositionDropdown,
    TaskTypesDropdown,
    LanguagesDropdown,
    NumericInput,
    BaseButton,
    BaseSwitch,
    FormInput,
  },
  effector: {
    $score,
    $taskType,
    $language,
    $count,
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
    setFolder,
    setScore,
    setTaskType,
    setLanguage,
    setCount,
    duplicateAssignment,
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
}
.tasks-count {
  display: flex;
  align-items: center;
}
.field {
  margin-bottom: 20px;
}
.field.numeric {
  width: 100%;
  & ::v-deep input {
    width: 100%;
  }
  & ::v-deep span {
    display: none;
  }
}
.text {
  font-weight: 600;
}
</style>
