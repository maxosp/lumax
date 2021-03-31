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
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import PositionDropdown from '@/pages/common/dropdowns/bank/position-dropdown/PositionDropdown.vue'
import TaskTypesDropdown from '@/pages/common/dropdowns/bank/task-types-dropdown/TaskTypesDropdown.vue'
import LanguagesDropdown from '@/pages/bank/lesson-tasks/edit/parts/languages-dropdown/LanguagesDropdown.vue'
import NumericInput from '@/ui/input/NumericInput.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
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

export default Vue.extend({
  name: 'TaskContent',
  components: {
    PositionDropdown,
    TaskTypesDropdown,
    LanguagesDropdown,
    NumericInput,
    BaseButton,
    FormInput,
  },
  effector: {
    $score,
    $taskType,
    $language,
    $count,
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
    .numeric-input-wrap {
      max-width: 190px;
      height: 46px;
      box-sizing: border-box;
      margin-right: 20px;
      & ::v-deep input {
        width: 110px;
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
