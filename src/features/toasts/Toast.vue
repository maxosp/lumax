<template>
  <div
    class="toast"
    :class="{ success: isSuccess, error: isError, loading: isLoading, 'no-internet': isNoInternet }"
  >
    <Icon
      :type="icon"
      class="icon"
      :class="{ success: isSuccess, error: isError, loading: isLoading, 'no-internet': isNoInternet }"
    />
    <p class="message">
      {{ toast.message }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Toast } from '@/features/toasts/toasts.model'
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  name: 'Toast',
  components: {
    Icon,
  },
  props: {
    toast: { type: Object as PropType<Toast>, required: true },
  },
  computed: {
    icon() {
      switch (this.toast.type) {
        case 'error':
          return 'close'
        case 'success':
          return 'tick'
        case 'loading':
          return 'loader'
        case 'no-internet':
          return 'wifi'
        default: {
          // Toast type unknown, icon break'
          return ''
        }
      }
    },
    isSuccess() {
      return this.toast.type === 'success'
    },
    isLoading() {
      return this.toast.type === 'loading'
    },
    isError() {
      return this.toast.type === 'error'
    },
    isNoInternet() {
      return this.toast.type === 'no-internet'
    },
  },
})
</script>

<style scoped>
:root {
  --success-color: var(--c-green-0);
  --warning-color: var(--c-yellow-0);
  --no-internet-color: var(--c-grey-0);
  --error-color: var(--c-red-0);
}
.toast {
  margin-top: 10px;
  z-index: 10;
  border-radius: 5px;
  background-color: #fff;
  min-width: 200px;
  max-width: 300px;
  padding: 14px 58px 17px 52px;
  display: flex;
  position: relative;

  &.success {
    background-color: var(--success-color);
  }
  &.warning {
    background-color: var(--warning-color);
  }
  &.error {
    background-color: var(--error-color);
  }
  &.no-internet {
    background-color: var(--no-internet-color);
  }
}

.icon {
  position: absolute;
  left: 20px;
  top: 17px;
  width: 18px;
  height: 18px;
  stroke: #fff;
  fill: #fff;

  &.error {
    width: 16px;
    height: 16px;
    stroke: none;
    fill: #fff;
    & ::v-deep use {
      fill: #fff !important;
    }
  }
  &.success {
    height: 14px;
    & ::v-deep use {
      fill: transparent !important;
    }
  }
}

.message {
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  line-height: 1.23;
}
</style>


