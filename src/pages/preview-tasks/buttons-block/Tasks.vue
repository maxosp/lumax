<template>
  <div class="buttons-block">
    <BaseButton
      v-if="[ 'revision', 'new', 'archive' ].includes($statusTask) && isTestTasks"
      class="btn"
      @click="$emit('onRevision')"
    >
      На проверку
    </BaseButton>
    <BaseButton
      v-if="'revision' === $statusTask && isTestTasks"
      class="btn"
      @click="$emit('onSeeComments')"
    >
      <Icon
        type="comment"
        size="20"
        class="icon"
      />
    </BaseButton>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import Icon from '@/ui/icon/Icon.vue'
import { $statusTask } from '@/pages/preview-tasks/preview-tasks-page.model'

export default Vue.extend({
  name: 'Controller',
  components: { BaseButton, Icon },
  props: {
    isTestTasks: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  effector: {
    $statusTask,
  },
})
</script>

<style scoped>
.btn {
  margin-left: 20px;
}
</style>
