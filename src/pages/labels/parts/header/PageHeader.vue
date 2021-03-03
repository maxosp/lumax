<template>
  <div class="header">
    <div class="title"> Метки для тестовых заданий </div>
    <div class="buttons">
      <BaseButton
        class="btn"
        yellow
        @click="modalVisibilityChanged(true)"
      >
        Добавить метку
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import { modalVisibilityChanged } from '@/pages/labels/parts/modals/label-creation/label-creation.model'

export default Vue.extend({
  components: {
    BaseButton,
  },
  methods: {
    modalVisibilityChanged,
  },
})
</script>

<style scoped>
.header {
  width: 100%;
  height: 58px;
  border-radius: 3px;
  @mixin flex-row-central;
  justify-content: space-between;
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.title {
  font-size: 20px;
  line-height: 18px;
  font-weight: 700;
  color: var(--base-text-primary);
}
.buttons {
  @mixin flex-row-central;
  .btn {
    min-width: 130px;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
  }
}
</style>
