<template>
  <div class='header'>
    <div class='title'>Создание задания для уроков</div>
    <div class='buttons'>
      <BaseButton class='btn' yellow>Сохранить и вернуться к списку</BaseButton>
      <BaseButton class='btn' yellow>Сохранить</BaseButton>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'

export default Vue.extend({
  name: 'TaskHeader',
  components: { BaseButton },
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
