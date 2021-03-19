<template>
  <div class="switchers-container">
    <BaseSwitch
      class="switch"
      :checked="$switchers.archive"
      @change="(val) => toggleSwitchers({ name: 'archive', value: val })"
    >
      <p> Перевести в архив </p>
    </BaseSwitch>
    <BaseSwitch
      class="switch"
      :checked="$switchers.reserve"
      @change="(val) => toggleSwitchers({name: 'reserve', value: val })"
    >
      <p> Перевести в резерв </p>
    </BaseSwitch>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import {
  $switchers,
  toggleSwitchers,
} from '@/pages/bank/lesson-tasks/list/parts/modals/tasks-update/parts/switchers/swichers.model'

export default Vue.extend({
  components: {
    BaseSwitch,
  },
  effector: {
    $switchers,
  },
  methods: {
    toggleSwitchers,
  },
})
</script>

<style scoped>
.switchers-container {
  @mixin flex-column-central;
  align-items: flex-start;
  margin: 20px 0;
}
.switch:not(:last-child) {
  margin-bottom: 15px;
}
</style>
