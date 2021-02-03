<template>
  <MenuWrap
    v-model="isShown"
    :position="position"
    :corner="corner"
    :position-offset="positionOffset"
  >
    <template #activator>
      <div
        ref="activatorWrap"
        class="activator-wrap"
        v-on="activatorHandlers"
      >
        <slot name="activator" />
      </div>
    </template>

    <template #menu>
      <Tooltip
        v-if="!disabled"
        :arrow="{
          position: getTooltipArrowPosition,
          corner: corner,
        }"
      >
        <slot name="tooltip-content" />
      </Tooltip>
    </template>
  </MenuWrap>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import MenuWrap from '@/ui/menu/MenuWrap.vue'
import Tooltip, { Position, Corner } from '@/ui/tooltip/Tooltip.vue'

type Actions = 'click' | 'mouseover' | 'mouseleave'

interface DataI {
  isShown: boolean
}

export default Vue.extend({
  name: 'WithTooltip',
  components: {
    MenuWrap,
    Tooltip,
  },
  props: {
    showOn: { type: String as PropType<Actions>, default: 'click' },
    hideOn: { type: String as PropType<Actions>, default: 'click' },
    position: { type: String as PropType<Position>, default: 'bottom' },
    corner: { type: String as PropType<Corner>, default: 'center' },
    positionOffset: { type: String as PropType<string>, default: '-9px' },
    disabled: { type: Boolean as PropType<boolean> },
  },
  data: (): DataI => ({
    isShown: false,
  }),

  computed: {
    activatorHandlers(): { [key in Actions]?: () => void } {
      if (this.disabled) return {}

      if (!this.hideOn || this.showOn === this.hideOn) {
        return { [this.showOn]: this.toggleTooltip }
      }
      return {
        [this.showOn]: this.toggleTooltip,
        [this.hideOn]: this.hideTooltip,
      }
    },
    getTooltipArrowPosition() {
      switch (this.position) {
        case 'bottom':
          return 'top'
        case 'left':
          return 'right'
        case 'right':
          return 'left'
        case 'top':
        default:
          return 'bottom'
      }
    },
  },

  watch: {
    isShown(val) {
      this.$emit('visibilityChanged', val)
    },
    disabled(val: boolean) {
      if (!val) this.isShown = false
    },
  },

  methods: {
    showTooltip() {
      this.isShown = true
    },
    hideTooltip() {
      this.isShown = false
    },
    toggleTooltip() {
      this.isShown = !this.isShown
    },
  },
})
</script>

<style scoped>
.activator-wrap {
  height: 100%;
}
</style>


