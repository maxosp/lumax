<template>
  <div class="buttons-block">
    <BaseButton
      v-if="currentStatus === 'на проверке'"
      class="btn green"
    >
      Утвердить
    </BaseButton>
    <BaseButton
      v-if="currentStatus === 'на проверке'"
      class="btn red"
    >
      На доработку
    </BaseButton>
    <BaseButton
      v-if="currentStatus === 'revision'"
      class="btn"
      yellow
    >
      Посмотреть/изменить комментарий
    </BaseButton>
    <BaseButton
      v-if="currentStatus === 'revision'"
      class="btn"
    >
      На проверку
    </BaseButton>
    <BaseButton
      v-if="currentStatus === 'finished'"
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

export default Vue.extend({
  name: 'Controller',
  components: { BaseButton },
  computed: {
    currentStatus() {
      // хз на проверке
      // revision на доработке
      // finished проверено
      return 'на проверке'
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
