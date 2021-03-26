<template>
  <Card class="controller">
    <div class="block">
      <div class="permission-controller">
        <BaseSwitch :checked="true">
          <p>Предпросмотр</p>
        </BaseSwitch>
        <BaseButton
          class="btn"
          yellow
        >
          Сохранить и вернуться к списку
        </BaseButton>
        <BaseButton
          class="btn"
          yellow
        >
          Сохранить
        </BaseButton>
      </div>
    </div>
    <Divider />
    <div class="block">
      <div class="status-block">
        <p class="label-status">Статус заявки:</p>
        <p class="value-status">На доработке</p>
      </div>
      <TasksButtons v-if="isTasks" />
      <ApplicationButtons v-else />
    </div>
  </Card>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '@/ui/card/Card.vue'
import Divider from '@/ui/divider/Divider.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import TasksButtons from '@/pages/preview-tasks/buttons-block/Tasks.vue'
import ApplicationButtons from '@/pages/preview-tasks/buttons-block/Application.vue'

export default Vue.extend({
  name: 'Controller',
  components: {
    Card,
    Divider,
    BaseButton,
    BaseSwitch,
    TasksButtons,
    ApplicationButtons,
  },
  computed: {
    isTasks() {
      return true
    },
  },
})
</script>

<style scoped>
.controller {
  padding: 0;
}
.block {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 20px;
  min-height: 40px;
  & .buttons-block {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
}
.permission-controller {
  display: flex;
  align-items: center;
  margin-left: auto;
  justify-content: flex-end;
}
.btn {
  margin-left: 20px;
}
.status-block {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.label-status {
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  margin-right: 10px;
}
.value-status {
  font-size: 14px;
  line-height: 17px;
}
</style>