<template>
  <div class='content'>
    <div class='base'>
      <div class='left'>
        <ThemesDropdown class="field" @setItem="setTheme" />
        <DifficultiesDropdown class="field" @setItem="setDifficulty" />
        <LabelsDropdown class="field" />
        <TaskTypesDropdown class="field" @setItem="setTaskType" />
        <component
          v-if="$taskType"
          :is="taskComponent"
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
import DifficultiesDropdown from '@/pages/task-creation/test/parts/difficulties-dropdown/DifficultiesDropdown.vue'
import LabelsDropdown from '@/pages/task-creation/test/parts/labels-dropdown/LabelsDropdown.vue'
import TaskTypesDropdown from '@/pages/task-creation/test/parts/task-types-dropdown/TaskTypesDropdown.vue'
import ThemesDropdown from '@/pages/task-creation/test/parts/themes-dropdown/ThemesDropdown.vue'
import {
  setTheme,
  setDifficulty,
  $needDuplicate,
  toggleNeedDuplicate,
  $count,
  setCount,
  $taskType,
  setTaskType,
} from '@/pages/task-creation/test/task-creation-page.model'
import * as tasks from '@/pages/task-creation/test/tasks'
import { mapTaskTypeToComponent } from '@/pages/task-creation/test/parts/task-types-dropdown/constants'

export default Vue.extend({
  name: 'TaskContent',
  components: {
    BaseSwitch,
    DifficultiesDropdown,
    LabelsDropdown,
    TaskTypesDropdown,
    ThemesDropdown,
    NumericInput,
  },
  effector: {
    $needDuplicate,
    $count,
    $taskType,
  },
  computed: {
    taskComponent() {
      const componentName = mapTaskTypeToComponent[this.$taskType]
      return componentName ? tasks[componentName] : null
    },
  },
  methods: {
    setTheme,
    setDifficulty,
    toggleNeedDuplicate,
    setCount,
    setTaskType,
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
  margin-top: 0px;
}
</style>