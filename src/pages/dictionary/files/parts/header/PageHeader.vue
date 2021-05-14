<template>
  <div class="header">
    <div class="title"> Системные файлы </div>
    <BaseButton
      class="btn btn_creating-theme"
      yellow
      @click="modalVisibilityChanged(true)"
    >
      Создать папку
    </BaseButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import { modalVisibilityChanged } from '@/pages/common/modals/system-files/create-folder/create-folder.model'

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
</style>
