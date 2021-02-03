<template>
  <div class="tooltip-wrap">
    <div class="tooltip">
      <div
        v-if="arrow"
        ref="arrow"
        class="arrow"
        :class="[arrow.position]"
        :style="{ ...getArrowStyles, ...refStyles }"
      />
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

type ArrowConfig =
  | false
  | {
      position: Position
      corner?: Corner
    }
  | {
      position: Position
      ref: HTMLElement
    }

export type Corner = 'center' | 'start' | 'end'
export type Position = 'top' | 'bottom' | 'left' | 'right'

export default Vue.extend({
  name: 'Tooltip',
  props: {
    arrow: { type: Object as PropType<ArrowConfig> },
  },
  data: () => ({
    refStyles: {},
  }),

  computed: {
    getArrowCornerPosition(): { [key in Position]?: string } {
      // @ts-ignore
      if (!this.arrow || this.arrow.ref) return {}
      // @ts-ignore
      const { position, corner = 'center' } = this.arrow
      let cssProperty
      if (position === 'top' || position === 'bottom') {
        cssProperty = corner === 'end' ? 'right' : 'left'
      } else {
        cssProperty = corner === 'end' ? 'bottom' : 'top'
      }

      return { [cssProperty]: corner === 'center' ? '50%' : '0' }
    },
    getArrowYTranslationValue(): string {
      if (!this.arrow) return '0'
      // @ts-ignore
      const { position, corner } = this.arrow

      switch (position) {
        case 'left':
        case 'right':
          return corner === 'center' ? '-50%' : '0'
        case 'bottom':
          return '100%'
        case 'top':
        default:
          return '-100%'
      }
    },
    getArrowXTranslationValue(): string {
      if (!this.arrow) return '0'
      // @ts-ignore
      const { position, corner } = this.arrow

      switch (position) {
        case 'right':
          return '100%'
        case 'left':
          return '-100%'
        case 'top':
        case 'bottom':
        default:
          return corner === 'center' ? '-50%' : '-10%'
      }
    },
    getArrowStyles(): any {
      if (!this.arrow) return {}

      const { position = 'top' } = this.arrow
      const mainOffset = '1px'

      let styles: any = {
        [position]: mainOffset,
        transform: `translate3d(${this.getArrowXTranslationValue}, ${this.getArrowYTranslationValue}, 0)`,
      }

      // @ts-ignore
      if (!this.arrow.ref) {
        styles = {
          ...styles,
          ...this.getArrowCornerPosition,
        }
      }

      return styles
    },
  },

  methods: {
    calculateRefStyles() {
      // @ts-ignore
      const { position, ref } = this.arrow
      if (!this.arrow || !ref) return

      // @ts-ignore
      const refEl = ref instanceof Vue ? ref.$el : ref

      const { x: elX, y: elY } = this.$el.getBoundingClientRect()
      const { x: refX, y: refY, width: refWidth, height: refHeight } = refEl.getBoundingClientRect()

      // @ts-ignore
      const { width: arrowWidth } = this.$refs.arrow.getBoundingClientRect()
      if (position === 'top' || position === 'bottom') {
        const diffX = (refWidth - arrowWidth) / 2
        this.refStyles = {
          left: `${refX - elX + diffX}px`,
        }
      } else {
        const diffY = (refHeight - arrowWidth) / 2
        this.refStyles = {
          top: `${refY - elY + diffY}px`,
        }
      }
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.calculateRefStyles()
    })
  },
})
</script>

<style scoped>
* {
  --bg-color: var(--c-grey-0);
  --opacity: 0.9;
}

.tooltip-wrap {
  position: relative;
  z-index: 10;
}
.tooltip {
  z-index: 2;
  background-color: #fff;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.15);
  opacity: var(--opacity);
  border-radius: 5px;
  font-weight: 600;
  line-height: 1.29;
}
.arrow {
  position: absolute;
  height: 12px;
  width: 12px;
  object-position: top center;
  object-fit: contain;
}
.arrow.top {
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 10px solid #fff;
}
.arrow.left {
  border-right: 10px solid #fff;
  border-bottom: 7px solid transparent;
  border-top: 7px solid transparent;
}
.arrow.right {
  border-left: 10px solid #fff;
  border-bottom: 7px solid transparent;
  border-top: 7px solid transparent;
}
.arrow.bottom {
  border-top: 10px solid #fff;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
}
</style>


