<template>
  <div class="switchers-container">
    <BaseSwitch
      class="switch"
      :checked="$switchers.isInArchive"
      @change="(val) => toggleSwitchers({ name: 'isInArchive', value: val })"
    >
      <p> Перевести в архив </p>
    </BaseSwitch>
    <BaseSwitch
      class="switch"
      :checked="$switchers.isInReserve"
      @change="(val) => toggleSwitchers({name: 'isInReserve', value: val })"
    >
      <p> Перевести в резерв </p>
    </BaseSwitch>
    <BaseSwitch
      class="switch"
      :checked="$switchers.isPublish"
      @change="(val) => toggleSwitchers({ name: 'isPublish', value: val })"
    >
      <p> Опубликовать </p>
    </BaseSwitch>
    <BaseSwitch
      class="switch"
      :checked="$switchers.isSend"
      @change="(val) => toggleSwitchers({ name: 'isSend', value: val })"
    >
      <p> Отправить заявки на проверку </p>
    </BaseSwitch>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import {
  $switchers,
  toggleSwitchers,
} from '@/pages/tasks-bank/modals/tasks-update/parts/switchers/swichers.model'

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
