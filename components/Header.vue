<template>
  <div class="container">
    <img src="~assets/images/Logo.png" alt="Логотип тип" class="logo">
    <div class="navbar">
      <AppButton class="nav-btn">Фильмы</AppButton>
      <AppButton class="nav-btn">Сериалы</AppButton>
      <AppButton class="nav-btn">Мультфильмы</AppButton>
    </div>
    <AppButton>Вход</AppButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppButton from '@/components/AppButton.vue'

export default Vue.extend({
  components: {
    AppButton
  }
})
</script>

<style lang="scss" scoped>
.container {
  @include flex-row;
  justify-content: space-between;
  background-color: $layout-background;
  padding: 15px $column-width;
  height: 73px;
  border-radius: 0 0 15px 15px;
  margin-bottom: 20px;
}

.nav-btn {
  background-color: transparent;
  color: #fff;

  &:hover {
    color: $primary-color;
  }
}
</style>
