<template>
  <ResizableBlock class="resizable" :style="{...sizesWithPx, zIndex}">
    <div ref="drag" :class="{drag: true, dragging: isDragging}">
      <div v-if="angleKey" :class="{key: true, left: leftKey, top: topKey}">
        {{angleKey}}
      </div>

      <Icon
        type="close"
        size="12px"
        :class="{close: true, right: leftKey, top: topKey}"
        @click="$emit('remove')"
      />
      <div class="content">
        <slot />
      </div>
      <div class='resizer' data-vector="top-left" />
      <div class='resizer' data-vector="top-right" />
      <div class='resizer' data-vector="bottom-left" />
      <div class='resizer' data-vector="bottom-right" />
      <div class='resizer ' data-vector="top" />
      <div class='resizer ' data-vector="left" />
      <div class='resizer ' data-vector="bottom" />
      <div class='resizer ' data-vector="right" />
    </div>
  </ResizableBlock>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { createCounter } from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/utils'
import Icon from '@/ui/icon/Icon.vue'
import {
  disableDocumentSelection,
  enableDocumentSelection,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/resizable/document-selection'
import { ResizableElementSizes } from '../types'
import ResizableBlock from './ResizableBlock.vue'

type Data = {
  scaledSizes: ResizableElementSizes
  isDragging: boolean
  zIndex: number
}

const zIndexCounter = createCounter()
const minimumSize = 10

export default Vue.extend({
  name: `ResizableElement`,
  components: {
    Icon,
    ResizableBlock,
  },
  props: {
    scale: {
      type: Number,
      default: 1,
    },
    sizes: {
      type: Object as PropType<ResizableElementSizes>,
      required: true,
    },
    angleKey: {
      type: String,
      default: '',
    },
  },
  data: (): Data => ({
    isDragging: false,
    scaledSizes: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    },
    zIndex: +zIndexCounter.next(),
  }),
  computed: {
    leftKey() {
      return this.scaledSizes.width < 50
    },
    topKey() {
      return this.scaledSizes.height < 40
    },
    sizesWithPx() {
      return {
        left: `${this.scaledSizes.left}px`,
        top: `${this.scaledSizes.top}px`,
        width: `${this.scaledSizes.width}px`,
        height: `${this.scaledSizes.height}px`,
      }
    },
  },
  watch: {
    sizes: {
      handler() {
        this.setSizesFromProps()
      },
      immediate: true,
    },
  },
  methods: {
    setSizesFromProps() {
      const nextWidth = this.sizes.width * this.scale
      const nextHeight = this.sizes.height * this.scale
      this.scaledSizes = {
        left: Math.floor(this.sizes.left * this.scale || 1),
        top: Math.floor(this.sizes.top * this.scale || 1),
        width: Math.floor(nextWidth > minimumSize ? nextWidth : minimumSize),
        height: Math.floor(nextHeight > minimumSize ? nextHeight : minimumSize),
      }
    },
    nextZIndex() {
      this.zIndex = +zIndexCounter.next()
    },
    setNext(sizes: Partial<ResizableElementSizes>) {
      const parent = this.$el.parentNode as HTMLElement

      const next: ResizableElementSizes = {
        ...this.scaledSizes,
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
        next.width = this.scaledSizes.width
      }
      if (next.left + next.width > parent.offsetWidth) {
        next.left = parent.offsetWidth - this.scaledSizes.width
        next.width = this.scaledSizes.width
      }
      if (next.top <= 0) {
        next.top = 0
        next.height = this.scaledSizes.height
      }
      if (next.top + next.height > parent.offsetHeight) {
        next.top = parent.offsetHeight - this.scaledSizes.height
        next.height = this.scaledSizes.height
      }

      this.$emit('change', {
        left: next.left / this.scale,
        top: next.top / this.scale,
        width: next.width / this.scale,
        height: next.height / this.scale,
      })
    },
    initResizing() {
      const element = this.$el as HTMLElement
      const resizers = this.$el.querySelectorAll<HTMLElement>(' .resizer')
      let originalWidth = 0
      let originalHeight = 0
      let originalX = 0
      let originalY = 0
      let originalMouseX = 0
      let originalMouseY = 0

      const createResizer = (currentResizer: HTMLElement) => {
        const resize = (e: MouseEvent) => {
          const vector = currentResizer.getAttribute('data-vector')

          const next = { ...this.scaledSizes }

          const bottomHandler = () => {
            next.height = originalHeight + (e.pageY - originalMouseY)
          }

          const rightHandler = () => {
            next.width = originalWidth + (e.pageX - originalMouseX)
          }

          const leftHandler = () => {
            next.width = originalWidth - (e.pageX - originalMouseX)
            next.left = originalX + (e.pageX - originalMouseX)
          }

          const topHandler = () => {
            next.height = originalHeight - (e.pageY - originalMouseY)
            next.top = originalY + (e.pageY - originalMouseY)
          }

          switch (vector) {
            case 'bottom-right':
              bottomHandler()
              rightHandler()
              break
            case 'bottom':
              bottomHandler()
              break
            case 'bottom-left':
              bottomHandler()
              leftHandler()
              break
            case 'left':
              leftHandler()
              break
            case 'top-right':
              rightHandler()
              topHandler()
              break
            case 'right':
              rightHandler()
              break
            case 'top':
              topHandler()
              break
            case 'top-left':
              topHandler()
              leftHandler()
              break
            default:
              break
          }

          this.setNext(next)
        }

        const stop = () => {
          enableDocumentSelection()
          window.removeEventListener('mousemove', resize)
          window.removeEventListener('mouseup', stop)
        }

        const start = (e: MouseEvent) => {
          // context menu
          if (e.button === 3) {
            return
          }
          disableDocumentSelection()
          this.nextZIndex()
          e.stopPropagation()
          e.preventDefault()
          originalWidth = parseFloat(
            getComputedStyle(element, null).getPropertyValue('width').replace('px', '')
          )
          originalHeight = parseFloat(
            getComputedStyle(element, null).getPropertyValue('height').replace('px', '')
          )
          originalX = element.offsetLeft
          originalY = element.offsetTop
          originalMouseX = e.pageX - this.$parent.$el.clientLeft
          originalMouseY = e.pageY - this.$parent.$el.clientTop
          window.addEventListener('mousemove', resize)
          window.addEventListener('mouseup', stop)
        }

        currentResizer.addEventListener('contextmenu', (e: MouseEvent) => {
          e.preventDefault()
          stop()
          this.$emit('contextmenu', e)
        })
        currentResizer.addEventListener('mousedown', start)
      }

      resizers.forEach(createResizer)
    },
    initDragging() {
      const element = this.$el as HTMLElement

      const dragging = (e: MouseEvent) => {
        this.setNext({
          left: this.scaledSizes.left + e.movementX,
          top: this.scaledSizes.top + e.movementY,
        })
      }

      const stop = () => {
        this.isDragging = false
        window.removeEventListener('mousemove', dragging)
        window.removeEventListener('mouseup', stop)
      }

      const start = (e: MouseEvent) => {
        // context menu
        if (e.button === 3) {
          return
        }
        this.nextZIndex()
        this.isDragging = true
        e.preventDefault()
        e.stopPropagation()
        window.addEventListener('mousemove', dragging)
        window.addEventListener('mouseup', stop)
      }

      element.addEventListener('contextmenu', (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        stop()
        this.$emit('contextmenu', e)
      })
      element.addEventListener('mousedown', start)
    },
  },
  mounted() {
    this.setSizesFromProps()
    this.initResizing()
    this.initDragging()
  },
})
</script>

<style scoped>
.close {
  position: absolute;
  right: 5px;
  top: 5px;
  fill: #000;
  cursor: pointer !important;
  z-index: 4;
  stroke-width: 0.3;
  stroke: #fff;
  transition: all 300ms;

  &.right {
    right: -18px;
  }
  &.top {
    top: -18px;
  }
}

.key {
  z-index: 2;
  position: absolute;
  left: 0px;
  top: 0px;
  font-size: 14px;
  line-height: 17px;
  color: #fff;
  padding: 2px 5px;
  background: var(--base-text-primary);

  transition: all 300ms;

  &.top {
    transform: translateY(calc(-100% - 5px));
  }

  &.left {
    transform: translateX(calc(-100% - 5px));
  }
}

.drag {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: grab;

  &.dragging {
    cursor: grabbing;
  }
}

.content {
  z-index: 1;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  white-space: nowrap;
  @mixin flex-center;
}

.resizer {
  width: 10px;
  height: 10px;
  position: absolute;
  z-index: 3;
}
[data-vector='top-left'] {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}
[data-vector='top-right'] {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
[data-vector='bottom-left'] {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
[data-vector='bottom-right'] {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
[data-vector='right'],
[data-vector='left'] {
  top: 5px;
  height: calc(100% - 10px);
  width: 10px;
  left: -5px;
  cursor: ew-resize;
}
[data-vector='right'] {
  left: unset;
  right: -5px;
}
[data-vector='top'],
[data-vector='bottom'] {
  left: 5px;
  width: calc(100% - 10px);
  height: 10px;
  top: -5px;
  cursor: ns-resize;
}
[data-vector='bottom'] {
  top: unset;
  bottom: -5px;
}
</style>