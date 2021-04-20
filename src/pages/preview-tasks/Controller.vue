<template>
  <Card class="controller">
    <div class="block">
      <div class="permission-controller">
        <BaseSwitch :checked="$isPreview" @change="toggleIsPreview">
          <p>Предпросмотр</p>
        </BaseSwitch>
        <BaseButton
          v-if="isPreviewPage"
          class="btn"
          yellow
        >
          Сохранить и вернуться к списку
        </BaseButton>
        <BaseButton
          v-if="isPreviewPage"
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
        <p class="value-status">{{ currentStatus }}</p>
      </div>
      <TasksButtons
        v-if="isTasks"
        :is-test-tasks="isTestTasks"
        @click="$emit('onSeeComments')"
        @onReview="$emit('onReview')"
      />
      <ApplicationButtons
        v-else
        @onAccept="$emit('onAccept')"
        @onSendForModeration="$emit('onSendForModeration')"
        @onSeeComments="$emit('onSeeComments')"
        @onReview="$emit('onReview')"
      />
    </div>
  </Card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Card from '@/ui/card/Card.vue'
import Divider from '@/ui/divider/Divider.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import TasksButtons from '@/pages/preview-tasks/buttons-block/Tasks.vue'
import ApplicationButtons from '@/pages/preview-tasks/buttons-block/Application.vue'
import { $statusTask } from '@/pages/preview-tasks/preview-tasks-page.model'
import { $isPreview, toggleIsPreview } from '@/pages/preview-tasks/controller.model'

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
  props: {
    isTasks: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    isTestTasks: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  effector: {
    $statusTask,
    $isPreview,
  },
  computed: {
    currentStatus() {
      // Костыль: не типизирует поле эффектора
      const status = (this as any).$statusTask
      switch (status) {
        case 'moderation':
          return 'На проверке'
        case 'revision':
          return 'На доработке'
        case 'finished':
          return 'Проверено'
        case 'new':
          return 'Новое'
        case 'reserve':
          return 'Резерв'
        case 'published':
          return 'Опубликовано'
        case 'archive':
          return 'Архив'
        default:
          return 'На проверке'
      }
    },
    isPreviewPage() {
      return this.$route.name !== 'preview-task'
    },
  },
  methods: {
    toggleIsPreview,
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
