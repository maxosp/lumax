<template>
  <div class='header'>
    <div class='title'>{{ title }}</div>
    <div class='buttons'>
      <BaseButton
        class="btn"
        yellow
        @click="$emit('saveAndBackToList')"
      >
        Сохранить и вернуться к списку
      </BaseButton>
      <BaseButton
        class="btn"
        yellow
        @click="$emit('save')"
      >
        Сохранить
      </BaseButton>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import { save } from '@/pages/bank/test-tasks/create/task-creation-page.model'

export default Vue.extend({
  name: 'TaskHeader',
  components: { BaseButton },
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  methods: { save },
})
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  background-color: #fff;
  border-radius: 3px;
  margin-bottom: 20px;
}
.title {
  color: var(--base-text-primary);
  font-weight: bold;
  font-size: 20px;
  line-height: 18px;
}
.btn + .btn {
  margin-left: 20px;
}
</style>
