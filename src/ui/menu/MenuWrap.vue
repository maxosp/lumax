<template>
  <div
    v-click-outside="clickOutside"
    class="wrap"
  >
    <slot
      name="activator"
      @click="toggleMenu"
    />

    <transition name="fade">
      <div
        v-if="value"
        class="menu-wrap"
        :class="{ open: value }"
        :style="{
          ...menuWrapStyles,
          width: menuWidth,
          height: menuHeight,
        }"
      >
        <slot name="menu" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

const ClickOutside = require('vue-click-outside')

export type Corner = 'center' | 'start' | 'end'
export type Position = 'top' | 'bottom' | 'left' | 'right'

export default Vue.extend({
  name: 'MenuWrap',
  directives: {
    ClickOutside,
  },
  props: {
    value: { type: Boolean as PropType<boolean> },
    position: { type: String as PropType<Position>, default: 'bottom' },
    corner: { type: String as PropType<Corner>, default: 'center' },
    positionOffset: { type: String as PropType<string>, default: null },
    cornerOffset: { type: String as PropType<string>, default: null },
    closeOnClickOutside: { type: Boolean as PropType<boolean>, default: true },
    menuWidth: { type: String as PropType<string>, default: 'max-content' },
    menuHeight: { type: String as PropType<string>, default: 'min-content' },
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  computed: {
    getCornerPosition(): { [key in Position]?: string } {
      let cssProperty
      let value = '0'
      if (this.position === 'top' || this.position === 'bottom') {
        cssProperty = this.corner === 'end' ? 'right' : 'left'
        // if this.position === 'left' | 'right'
      } else {
        cssProperty = this.corner === 'end' ? 'bottom' : 'top'
      }

      if (this.corner === 'center') {
        value = '50%'
      } else {
        value = this.cornerOffset ?? '0'
      }
      return { [cssProperty]: value }
    },

    getYTranslationValue(): string {
      switch (this.position) {
        case 'left':
        case 'right':
          return this.corner === 'center' ? '-50%' : '0'
        case 'bottom':
          return '100%'
        case 'top':
        default:
          return '-100%'
      }
    },
    getXTranslationValue(): string {
      switch (this.position) {
        case 'right':
          return '100%'
        case 'left':
          return '-100%'
        case 'top':
        case 'bottom':
        default:
          return this.corner === 'center' ? '-50%' : '0'
      }
    },

    menuWrapStyles(): any {
      const mainPositionProperty = this.position
      const positionOffset = this.positionOffset ?? '0'
      return {
        [mainPositionProperty]: positionOffset,
        ...this.getCornerPosition,
        transform: `translate3d(${this.getXTranslationValue}, ${this.getYTranslationValue}, 0)`,
      }
    },
  },

  methods: {
    clickOutside() {
      if (this.closeOnClickOutside) {
        this.closeMenu()
      }
    },

    toggleMenu() {
      if (this.value) {
        this.closeMenu()
      } else {
        this.openMenu()
      }
    },

    openMenu() {
      this.$emit('change', true)
    },

    closeMenu() {
      this.$emit('change', false)
    },
  },
})
</script>

<style scoped>
.wrap {
  position: relative;
  z-index: auto;
}

.menu-wrap {
  position: absolute;
  width: max-content;
  min-width: 220px;
  height: min-content;
  visibility: hidden;
  z-index: 2;

  &.open {
    visibility: visible;
    z-index: 7;
  }

  &.center {
    left: 50%;
  }
}
</style>


