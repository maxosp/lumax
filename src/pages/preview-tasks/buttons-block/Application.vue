<template>
  <div class="buttons-block">
    <BaseButton
      v-if="$statusTask === 'moderation'"
      class="btn green"
      @click="$emit('onAccept')"
    >
      Утвердить
    </BaseButton>
    <BaseButton
      v-if="$statusTask === 'moderation'"
      class="btn red"
      @click="$emit('onSendForModeration')"
    >
      На доработку
    </BaseButton>
    <BaseButton
      v-if="$statusTask === 'revision'"
      class="btn"
      yellow
      @click="$emit('onSeeComments')"
    >
      Посмотреть/изменить комментарий
    </BaseButton>
    <BaseButton
      v-if="$statusTask === 'revision'"
      class="btn"
      @click="$emit('onReview')"
    >
      На проверку
    </BaseButton>
    <BaseButton
      v-if="$statusTask === 'finished'"
      class="btn"
      yellow
    >
      Посмотреть комментарий (если есть)
    </BaseButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import { $statusTask } from '@/pages/preview-tasks/preview-tasks-page.model'

export default Vue.extend({
  name: 'Controller',
  components: { BaseButton },
  effector: {
    $statusTask,
  },
})
</script>

<style scoped>
.btn {
  margin-left: 20px;
}
.red {
  background-color: #eb4b28;
}
.green {
  background-color: #67b414;
}
</style>
