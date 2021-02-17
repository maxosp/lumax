<template>
  <div class='content'>
    <div class='base'>
      <div class='left'>
        <TaskTypesDropdown class="field" />
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
import TaskTypesDropdown from '@/pages/task-creation/lesson/parts/task-types-dropdown/TaskTypesDropdown.vue'
import {
  setTheme,
  $needDuplicate,
  toggleNeedDuplicate,
  $count,
  setCount,
} from '@/pages/task-creation/test/task-creation-page.model'

export default Vue.extend({
  name: 'TaskContent',
  components: {
    BaseSwitch,
    NumericInput,
    TaskTypesDropdown,
  },
  effector: {
    $needDuplicate,
    $count,
  },
  methods: {
    setTheme,
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