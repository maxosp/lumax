<template>
  <ResizableBlock
    v-if="dragging"
    class="resizable-creator"
    :style="{...sizesWithPx}"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import ResizableBlock from '@/pages/bank/test-tasks/create/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/resizable/ResizableBlock.vue'
import { ResizableElementSizes } from '@/pages/bank/test-tasks/create/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/types'
import {
  disableDocumentSelection,
  enableDocumentSelection,
} from '@/pages/bank/test-tasks/create/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/resizable/document-selection'

const minimumSize = 10

const defaultSizes = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
}

export default Vue.extend({
  name: `ResizableCreator`,
  components: { ResizableBlock },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    scale: {
      type: Number,
      default: 1,
    },
  },
  data: () => ({
    dragging: false,
    sizes: {
      ...defaultSizes,
    },
  }),
  computed: {
    sizesWithPx() {
      return {
        left: `${this.sizes.left}px`,
        top: `${this.sizes.top}px`,
        width: `${this.sizes.width}px`,
        height: `${this.sizes.height}px`,
      }
    },
  },
  methods: {
    reset() {
      this.sizes = {
        ...defaultSizes,
      }
    },
    setNext(sizes: Partial<ResizableElementSizes>) {
      const parent = this.$el.parentNode as HTMLElement

      const next: ResizableElementSizes = {
        ...this.sizes,
        ...sizes,
      }

      if (next.width < minimumSize) {
        next.width = minimumSize
      }
      if (next.height < minimumSize) {
        next.height = minimumSize
      }

      if (next.left <= 0) {
        next.left = 0
        next.width = this.sizes.width
      }
      if (next.left + next.width > parent.offsetWidth) {
        next.left = parent.offsetWidth - this.sizes.width
        next.width = this.sizes.width
      }
      if (next.top <= 0) {
        next.top = 0
        next.height = this.sizes.height
      }
      if (next.top + next.height > parent.offsetHeight) {
        next.top = parent.offsetHeight - this.sizes.height
        next.height = this.sizes.height
      }

      this.sizes = {
        ...next,
      }
    },
    unfocused() {
      this.$emit('unfocused')
    },
    initResizing() {
      let originalWidth = 0
      let originalHeight = 0
      let originalMouseX = 0
      let originalMouseY = 0

      const createResizer = (parentEl: HTMLElement) => {
        const resize = (e: MouseEvent) => {
          if (this.disabled) {
            return
          }
          const next = { ...this.sizes }

          next.height = originalHeight + (e.pageY - originalMouseY)
          next.width = originalWidth + (e.pageX - originalMouseX)

          this.setNext(next)
        }

        const stop = () => {
          if (this.disabled) {
            return
          }
          enableDocumentSelection()

          this.dragging = false
          window.removeEventListener('mousemove', resize)
          window.removeEventListener('mouseup', stop)

          this.$emit('created', {
            position: {
              x: this.sizes.left / this.scale,
              y: this.sizes.top / this.scale,
            },
            size: {
              width: this.sizes.width / this.scale,
              height: this.sizes.height / this.scale,
            },
          })

          this.reset()
        }

        const start = (e: MouseEvent) => {
          if (this.disabled) {
            return
          }
          disableDocumentSelection()

          // context menu
          this.dragging = true
          e.stopPropagation()
          e.preventDefault()
          originalWidth = this.sizes.width
          originalHeight = this.sizes.height
          originalMouseX = e.pageX - this.$parent.$el.clientLeft
          originalMouseY = e.pageY - this.$parent.$el.clientTop

          this.sizes.left = e.offsetX - this.$parent.$el.clientLeft
          this.sizes.top = e.offsetY - this.$parent.$el.clientTop
          window.addEventListener('mousemove', resize)
          window.addEventListener('mouseup', stop)
        }

        parentEl.addEventListener('mousedown', start)
      }

      if (this.$el.parentNode) {
        createResizer(this.$el.parentNode as HTMLElement)
      }
    },
  },
  mounted() {
    this.initResizing()
    window.addEventListener('mousedown', this.unfocused)
  },
  destroyed() {
    window.removeEventListener('mousedown', this.unfocused)
  },
})
</script>

<style scoped>
.resizable-creator {
  z-index: 10000;
}
</style>
