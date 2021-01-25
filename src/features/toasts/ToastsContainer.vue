<template>
  <div class="fixed-container">
    <div class="toast-container">
      <Toast
        v-for="(toast, index) in $toasts"
        :key="index"
        :toast="toast"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Toast from '@/features/toasts/Toast.vue'
import { $toasts } from '@/features/toasts/toasts.model'

export default {
  name: 'ToastsContainer',
  effector: {
    $toasts,
  },
  components: { Toast },
}
</script>

<style scoped>
.fixed-container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;

  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  pointer-events: none;
  z-index: 1000;
}

.toast-container {
  padding-right: 20px;
  padding-bottom: 20px;
  @mixin between-childs {
    margin-top: 20px;
  }
}
</style>


