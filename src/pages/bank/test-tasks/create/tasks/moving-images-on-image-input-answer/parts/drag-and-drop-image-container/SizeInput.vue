<template>
  <div class="size-input">
    <BaseInput
      :value="size.width"
      type="number"
      class="size image-width"
      @input="changeWidth"
    />
    <Icon
      :class="{relative: true, enabled: relative}"
      size="18px"
      type="relative"
      @click="relative = !relative"
    />
    <BaseInput
      :value="size.height"
      type="number"
      class="size image-height"
      @input="changeHeight"
    />
    px
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseInput from '@/ui/input/BaseInput.vue'
import { Size } from '@/pages/bank/test-tasks/create/tasks/types'

export default Vue.extend({
  name: `SizeInput`,
  components: {
    Icon,
    BaseInput,
  },
  props: {
    size: {
      type: Object as PropType<Size>,
      required: true,
    },
  },
  data: () => ({
    relative: false,
    lastScale: 1,
  }),
  watch: {
    relative() {
      this.lastScale = this.size.width / this.size.height || 1
    },
  },
  methods: {
    changeWidth(width: number) {
      if (this.relative) {
        this.$emit('change', {
          width,
          height: width / this.lastScale,
        })
        return
      }
      this.$emit('change', {
        ...this.size,
        width,
      })
    },
    changeHeight(height: number) {
      if (this.relative) {
        this.$emit('change', {
          height,
          width: height * this.lastScale,
        })
        return
      }
      this.$emit('change', {
        ...this.size,
        height,
      })
    },
  },
})
</script>

<style scoped>
.size-input {
  font-size: 14px;
  line-height: 17px;
  color: var(--base-text-primary);
  display: flex;
  align-items: center;
}
.image-width {
  margin-right: 11px;
}
.image-height {
  margin-left: 11px;
  margin-right: 5px;
}
.size {
  width: 70px;
  height: 30px;
  background: var(--c-grey-5);
  border: 1px solid var(--c-grey-6);
  box-sizing: border-box;
  border-radius: 5px;
  font-size: inherit;
  font-family: inherit;
}
.relative {
  fill: var(--c-grey-3);
  cursor: pointer;
  &.enabled {
    fill: var(--base-text-primary);
  }
}
</style>
