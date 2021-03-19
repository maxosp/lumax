<template>
  <div :class="{ spinner: true, full }">
    <Icon
      type="spinner"
      size="30px"
      class="icon"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  name: `Spinner`,
  components: { Icon },
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style scoped>
.spinner {
  width: 100%;
  background: #fff;
  @mixin flex-center;
}

.full {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
}

.icon {
  animation: spin 1s ease-out infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg) scale(1.5);
  }
}
</style>
