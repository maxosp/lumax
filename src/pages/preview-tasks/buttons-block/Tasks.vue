<template>
  <div class="buttons-block">
    <BaseButton
      v-if="![ 'reserve', 'published', 'archive' ].includes(currentStatus) && isTestTasks"
      class="btn"
      @click="$emit('onRevision')"
    >
      На проверку
    </BaseButton>
    <BaseButton
      v-if="['revision'].includes(currentStatus) && isTestTasks"
      class="btn"
      @click="$emit('onSeeComments')"
    >
      Комментарий модератора
    </BaseButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'

export default Vue.extend({
  name: 'Controller',
  components: { BaseButton },
  computed: {
    currentStatus() {
      // new новое
      // хз на проверке
      // revision на доработке
      // reserve в резерве
      // published опубликовано
      // archive в архиве
      return 'new'
    },
    isTestTasks() {
      return true
    },
  },
})
</script>

<style scoped>
.btn {
  margin-left: 20px;
}
</style>
