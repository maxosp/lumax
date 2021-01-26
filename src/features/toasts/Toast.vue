<template>
  <div
    class="toast"
    :class="{ success: isSuccess, error: isError, warning: isWarning }"
  >
    <Icon
      :type="icon"
      class="icon"
      :class="{ success: isSuccess, error: isError, warning: isWarning }"
    />
    <h4 class="title">
      {{ title }}
    </h4>
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
        default: {
          // Toast type unknown, icon break'
          return ''
        }
      }
    },
    title() {
      return {
        success: 'Успех:',
        error: 'Ошибка:',
      }[this.toast.type]
    },
    isSuccess() {
      return this.toast.type === 'success'
    },
    isWarning() {
      return this.toast.type === 'warning'
    },
    isError() {
      return this.toast.type === 'error'
    },
  },
})
</script>

<style scoped>
:root {
  --success-color: var(--c-green-0);
  --warning-color: var(--c-yellow-0);
  --error-color: var(--c-red-0);
}
.toast {
  margin-top: 10px;
  z-index: 10;
  border-radius: 5px;
  background-color: #fff;
  min-width: 200px;
  max-width: 300px;
  padding: 20px 20px 20px 60px;
  display: flex;
  flex-direction: column;
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
}

.icon {
  position: absolute;
  left: 20px;
  top: 20px;
  width: 18px;
  height: 18px;
  stroke: #fff;
  fill: transparent;

  &.error {
    width: 16px;
    height: 16px;
    stroke: none;
    fill: #fff;
  }
}

.title {
  margin: 0;
  font-weight: bold;
  line-height: 1.14;
  color: #ffffff;
}

.message {
  margin-top: 5px;
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  line-height: 1.23;
}
</style>


