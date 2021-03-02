<template>
  <div class="header">
    <span class="title">Библиотека ресурсов</span>
    <div class="buttons">
      <RouterLink :to="{ name: 'themes-create' }">
        <BaseButton
          class="btn"
          yellow
        >
          Добавить папку
        </BaseButton>
      </RouterLink>
      <RouterLink :to="{ name: 'themes-create' }">
        <BaseButton
          class="btn"
          yellow
        >
          Добавить ресурс
        </BaseButton>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'

export default Vue.extend({
  name: 'PageHeader',
  components: {
    BaseButton,
  },
})
</script>

<style scoped>
.header {
  width: 100%;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  border-radius: 3px;
  margin-bottom: 20px;
}

.title {
  color: var(--base-text-primary);
  font-size: 20px;
  font-weight: bold;
}

.buttons {
  display: flex;
}

.btn {
  min-width: 130px;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
}
a:first-child .btn {
  margin-right: 20px;
}
</style>
