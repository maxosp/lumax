<template>
  <div
    class="scrollbar"
    :class="classes"
  >
    <div
      ref="simpleBar"
      class="simple-bar"
      :style="{ 'max-height': maxHeight ? `${maxHeight}px` : 'none' }"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import 'simplebar/dist/simplebar.min.css'
import SimpleBar from 'simplebar'

export default Vue.extend({
  name: 'ScrollContainer',
  props: {
    maxHeight: { type: [Number, null] as PropType<number | null>, default: null },
    hideHorizontal: { type: Boolean as PropType<boolean> },
    autoHide: { type: Boolean as PropType<boolean>, default: true },
    hideVertical: { type: Boolean as PropType<boolean> },
    loading: { type: Boolean as PropType<boolean> },
  },
  data: () => ({
    bar: {} as SimpleBar,
    scrollElement: {} as HTMLElement,
    contentElement: {} as HTMLElement,
    scrollOffset: 100,
  }),
  computed: {
    classes() {
      return {
        'hide-horizontal': this.hideHorizontal,
        'hide-vertical': this.hideVertical,
      }
    },
  },

  watch: {
    loading(newVal) {
      if (!newVal) {
        Vue.nextTick(() => this.bar.recalculate())
      }
    },
  },

  mounted() {
    this.bar = new SimpleBar(this.$refs.simpleBar as HTMLElement)
    this.scrollElement = this.bar.getScrollElement()
    this.contentElement = this.bar.getContentElement()
    this.bar.getScrollElement().addEventListener('scroll', () => {
      const scrollElementBottomPosition = this.scrollElement.getClientRects()[0].bottom
      const contentElementBottomPosition = this.contentElement.getClientRects()[0].bottom
      const loadStartPosition = contentElementBottomPosition - this.scrollOffset

      if (loadStartPosition <= scrollElementBottomPosition && !this.loading) {
        this.$emit('infiniteHandler')
      }
    })
  },
})
</script>

<style scoped>
* {
  --scrollbar-side-margin: 15px;
  --scrollbar-bg-color: var(--base-text-primary);
  --track-bg-color: transparent;
}

.scrollbar {
  width: 100%;
  height: 100%;
  max-width: inherit;
  max-height: inherit;
  position: relative;
  overflow: hidden;
}
.simple-bar {
  height: 100%;
  z-index: 1;
}

.scrollbar >>> .simplebar-track {
  opacity: 1;
  background-color: var(--track-bg-color) !important;
}
/*.scrollbar:hover >>> .simplebar-track {
  opacity: 1;
}*/

.sticky-horizontal >>> .simplebar-track.simplebar-horizontal {
  position: sticky;
  bottom: 10px;
}

.hide-horizontal >>> {
  .simplebar-track.simplebar-horizontal,
  .simplebar-track.simplebar-horizontal .simplebar-scrollbar {
    display: none;
  }
}

.hide-vertical >>> {
  .simplebar-track.simplebar-vertical,
  .simplebar-track.simplebar-vertical .simplebar-scrollbar {
    display: none;
  }
}

.scrollbar >>> .simplebar-track.simplebar-horizontal {
  margin: 0 var(--scrollbar-side-margin);
  width: calc(100% - 2 * var(--scrollbar-side-margin));
  height: 4px;
  left: 0;
  height: 14px;
  border-radius: 3px;
}
.scrollbar >>> .simplebar-track.simplebar-horizontal .simplebar-scrollbar {
  top: 0;
  height: 6px;
  border-radius: 3px;
  background-color: var(--scrollbar-bg-color);
  cursor: pointer;
}
.scrollbar >>> .simplebar-scrollbar:before {
  background-color: var(--scrollbar-bg-color) !important;
}

.scrollbar >>> .simplebar-track.simplebar-vertical.simplebar-scrollbar:before {
  bottom: 0;
  top: 0;
}

.scrollbar >>> .simplebar-visible:before {
  background-color: var(--track-bg-color) !important;
}

.scrollbar.red >>> .simplebar-visible:before {
  background-color: var(--track-bg-color) !important;
}

.scrollbar >>> .simplebar-track.simplebar-vertical {
  margin: var(--scrollbar-side-margin) 0;
  right: 0;
  width: 14px;
  height: calc(100% - 2 * var(--scrollbar-side-margin));
  background-color: var(--track-bg-color);
}
.scrollbar >>> .simplebar-track.simplebar-vertical .simplebar-scrollbar {
  width: 4px;
  cursor: pointer;
  border-radius: 3px;
  background-color: var(--scrollbar-bg-color);
  position: absolute;
  left: unset;
  right: 0;
}
.scrollbar >>> .simplebar-content {
  padding-right: 15px;
}
</style>


