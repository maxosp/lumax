<template>
  <Card class="controller">
    <div class="top">
      <div class="permission-controller">
        <BaseSwitch :checked="$isPreview" @change="toggleIsPreview">
          <p>Предпросмотр</p>
        </BaseSwitch>
        <BaseButton
          v-if="!$isPreview"
          class="btn"
          yellow
        >
          Сохранить и вернуться к списку
        </BaseButton>
        <BaseButton
          v-if="!$isPreview"
          class="btn"
          yellow
        >
          Сохранить
        </BaseButton>
      </div>
    </div>
    <Divider />
    <StatusController
      :from-page="fromPage"
      :task-type="taskType"
      :is-preview="$isPreview"
      @onAccept="$emit('onAccept')"
      @onSendToRevision="$emit('onSendToRevision')"
      @onSeeComments="$emit('onSeeComments')"
      @onSendToReview="$emit('onSendToReview')"
    />
  </Card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Card from '@/ui/card/Card.vue'
import Divider from '@/ui/divider/Divider.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import { $isPreview, toggleIsPreview } from '@/pages/preview-tasks/controller.model'
import StatusController from '@/pages/common/parts/status-controller/StatusContoller.vue'

export default Vue.extend({
  name: 'Controller',
  components: {
    Card,
    Divider,
    BaseButton,
    BaseSwitch,
    StatusController,
  },
  props: {
    fromPage: { type: String as PropType<string>, required: true },
    taskType: { type: String as PropType<string> },
  },
  effector: {
    $isPreview,
  },
  methods: {
    toggleIsPreview,
  },
})
</script>

<style scoped>
.controller {
  padding: 0;
  margin-bottom: 20px;
}
.top {
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
</style>
