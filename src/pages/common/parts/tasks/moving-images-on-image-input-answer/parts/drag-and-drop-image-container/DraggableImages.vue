<template>
  <div class="images">
    <ResizableElement
      v-for="image in $droppableImages"
      :key="image.id"
      :scale="$scale"
      :sizes="sizesToResizer(image)"
      :angle-key="`A${image.value}`"
      @change="updateSizes(image, $event)"
      @contextmenu.stop="openContext($event, image.id)"
      @remove="removeDroppableImage(image)"
    >
      <img
        v-if="getImage(image)"
        :src="getImage(image)"
        class="image"
      >
    </ResizableElement>

    <ImageContextMenu
      v-if="currentContextImage"
      :cords="contextCoords"
      :position="currentContextImage.position"
      :size="currentContextImage.size"
      :color="currentContextImage.color"
      @changeSize="changeContext('size', $event)"
      @changePosition="changeContext('position', $event)"
      @changeColor="changeContext('color', $event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  $droppableImages,
  $draggableImages,
  replaceDroppableImage,
  removeDroppableImage,
  $scale,
} from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/form/moving-images-on-image-answer-form.model'
import { DroppableImage, DraggableImage } from '@/pages/common/parts/tasks/types'
import { ResizableElementSizes } from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/types'
import ImageContextMenu from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/ImageContextMenu.vue'

import ResizableElement from './resizable/ResizableElement.vue'

export default Vue.extend({
  name: `DraggableImages`,
  components: {
    ResizableElement,
    ImageContextMenu,
  },
  effector: {
    $droppableImages,
    $draggableImages,
    $scale,
  },
  data: () => ({
    contextKey: 0,
    contextCoords: {
      x: 0,
      y: 0,
    },
  }),
  computed: {
    currentContextImage(): DroppableImage | undefined {
      return this.$droppableImages.find((input) => input.id === this.contextKey)
    },
  },
  methods: {
    removeDroppableImage,
    getImage(image: DroppableImage) {
      return (this.$draggableImages as DraggableImage[]).find((item) => item.value === image.value)
        ?.image
    },
    changeContext(key: keyof DroppableImage, value: DroppableImage[keyof DroppableImage]) {
      const contextElement = this.currentContextImage
      if (contextElement) {
        replaceDroppableImage({
          ...contextElement,
          [key]: value,
        })
      }
    },
    closeContext() {
      this.contextKey = 0
    },
    openContext(e: MouseEvent, key: number) {
      this.contextCoords.x = e.x
      this.contextCoords.y = e.y
      this.contextKey = key
    },
    sizesToResizer(image: DroppableImage) {
      return {
        ...image.size,
        ...{
          left: image.position.x,
          top: image.position.y,
        },
      }
    },
    updateSizes(image: DroppableImage, sizes: ResizableElementSizes) {
      replaceDroppableImage({
        ...image,
        position: {
          x: sizes.left,
          y: sizes.top,
        },
        size: {
          width: sizes.width,
          height: sizes.height,
        },
        pin: {
          x: sizes.width / 2,
          y: sizes.height / 2,
        },
      })
    },
  },

  destroyed() {
    window.removeEventListener('mousedown', this.closeContext)
    document.getElementById('app')?.removeEventListener('scroll', this.closeContext)
  },
  mounted() {
    window.addEventListener('mousedown', this.closeContext)
    document.getElementById('app')?.addEventListener('scroll', this.closeContext)
  },
})
</script>

<style scoped>
.images {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.image {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}
</style>
