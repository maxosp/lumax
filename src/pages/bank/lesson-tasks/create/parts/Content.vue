<template>
  <div class='content'>
    <div class='base'>
      <div class='left'>
        <PositionDropdown class="field" @setItem="setFolder" />
        <div class="score-wrapper">
          <p class="text"> Баллы </p>
          <NumericInput
            class="field numeric"
            :value="+$score"
            placeholder="Введите количество баллов"
            @input="setScore"
          />
        </div>
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
        <NumericInput :value="+$count" @input="setCount" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import PositionDropdown from '@/pages/common/dropdowns/bank/position-dropdown/PositionDropdown.vue'
import TaskTypesDropdown from '@/pages/common/dropdowns/bank/task-types-dropdown/TaskTypesDropdown.vue'
import LanguagesDropdown from '@/pages/bank/lesson-tasks/create/parts/languages-dropdown/LanguagesDropdown.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import NumericInput from '@/ui/input/NumericInput.vue'
import {
  setFolder,
  setScore,
  $score,
  $taskType,
  setTaskType,
  $language,
  setLanguage,
  $needDuplicate,
  toggleNeedDuplicate,
  $count,
  setCount,
} from '@/pages/bank/lesson-tasks/create/task-creation-page.model'
import * as tasks from '@/pages/common/parts/tasks/'
import { mapTaskTypeTo } from '@/pages/common/constants'

export default Vue.extend({
  name: 'TaskContent',
  components: {
    PositionDropdown,
    TaskTypesDropdown,
    LanguagesDropdown,
    BaseSwitch,
    NumericInput,
  },
  effector: {
    $score,
    $taskType,
    $language,
    $needDuplicate,
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
    toggleNeedDuplicate,
    setCount,
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
