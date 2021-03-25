<template>
  <div class="inputs">
    <ResizableElement
      v-for="input in $inputs"
      :key="input.id"
      :scale="$scale"
      :sizes="sizesToResizer(input)"
      :angle-key="`B${input.id}`"
      @change="updateSizes(input, $event)"
      @contextmenu.stop="openContext($event, input.id)"
      @remove="removeInput(input)"
    >
      {{input.value[0].value}}
    </ResizableElement>

    <ImageContextMenu
      v-if="currentContextInput"
      :cords="contextCoords"
      :position="currentContextInput.position"
      :size="currentContextInput.size"
      :color="currentContextInput.color"
      @changeSize="changeContext('size', $event)"
      @changePosition="changeContext('position', $event)"
      @changeColor="changeContext('color', $event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  $inputs,
  $scale,
  replaceInput,
  removeInput,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/form/moving-images-on-image-answer-form.model'
import { DroppableInput } from '@/pages/bank/test-tasks/tasks/types'
import { ResizableElementSizes } from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/types'
import ImageContextMenu from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/ImageContextMenu.vue'
import ResizableElement from './resizable/ResizableElement.vue'

export default Vue.extend({
  name: `DraggableInputs`,
  components: {
    ImageContextMenu,
    ResizableElement,
  },
  effector: {
    $inputs,
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
    currentContextInput(): DroppableInput | undefined {
      return this.$inputs.find((input) => input.id === this.contextKey)
    },
  },
  methods: {
    removeInput,
    changeContext(key: keyof DroppableInput, value: DroppableInput[keyof DroppableInput]) {
      const contextElement = this.currentContextInput
      if (contextElement) {
        replaceInput({
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
    sizesToResizer(input: DroppableInput) {
      return {
        ...input.size,
        ...{
          left: input.position.x,
          top: input.position.y,
        },
      }
    },
    updateSizes(input: DroppableInput, sizes: ResizableElementSizes) {
      replaceInput({
        ...input,
        position: {
          x: sizes.left,
          y: sizes.top,
        },
        size: {
          width: sizes.width,
          height: sizes.height,
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
.inputs {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
