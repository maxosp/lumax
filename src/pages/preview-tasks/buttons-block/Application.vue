<template>
  <div class="buttons-block">
    <BaseButton
      v-if="currentStatus === 'на проверке'"
      class="btn green"
      @click="$emit('onAccept')"
    >
      Утвердить
    </BaseButton>
    <BaseButton
      v-if="currentStatus === 'на проверке'"
      class="btn red"
      @click="$emit('onSendForModeration')"
    >
      На доработку
    </BaseButton>
    <BaseButton
      v-if="currentStatus === 'revision'"
      class="btn"
      yellow
      @click="$emit('onSeeComments')"
    >
      Посмотреть/изменить комментарий
    </BaseButton>
    <BaseButton
      v-if="currentStatus === 'revision'"
      class="btn"
      @click="$emit('onRevision')"
    >
      На проверку
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
      // хз на проверке
      // revision на доработке
      // finished проверено
      return 'revision'
    },
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
