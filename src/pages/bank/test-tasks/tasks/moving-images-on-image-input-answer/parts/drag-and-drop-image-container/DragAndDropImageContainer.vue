<template>
  <div class="drag-and-drop-image-container">
    <ImageContextMenu v-if="false" />
    <div class="header">
      <FormLabel>Фоновое изображение</FormLabel>
      <div class="actions">
        <template v-if="!$hideDragAndDropControls">
          <BaseButton class="add-image button" @click="setNextResizerToImage">+ изображение</BaseButton>
          <BaseButton class="button" @click="setNextResizerToText">+ текст</BaseButton>
        </template>
      </div>
    </div>
    <div class="drag-and-drop-image">
      <Spinner v-if="$mainImageUploading" full />
      <FilePicker
        v-if="$hideDragAndDropControls"
        accept="image/*"
        @change="uploadMainImage"
      >
        <div class="placeholder">
          Загрузите фоновое изображение
        </div>
      </FilePicker>
      <div v-if="!$hideDragAndDropControls" class="background-image-wrapper">
        <ResizableCreator
          :disabled="!$canCreateResizableBlock"
          :scale="$scale"
          @created="createResizableBlock"
          @unfocused="resetNextResizableBlock"
        />
        <DraggableInputs />
        <DraggableImages />
        <img
          :src="$mainImage"
          class="background-image"
          :style="scaledSizes"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import FormLabel from '@/ui/label/FormLabel.vue'
import {
  $mainImage,
  uploadMainImage,
  setContainerWidth,
  $mainImageUploading,
  $hideDragAndDropControls,
  $mainImageSize,
  $scale,
  addInput,
  addDroppableImage,
  createResizableBlock,
  $canCreateResizableBlock,
  setNextResizerToText,
  setNextResizerToImage,
  setNextResizableBlockType,
} from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/form/moving-images-on-image-answer-form.model'
import FilePicker from '@/ui/file-picker/FilePicker.vue'
import Spinner from '@/ui/spinner/Spinner.vue'
import DraggableInputs from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/DraggableInputs.vue'
import DraggableImages from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/DraggableImages.vue'
import ResizableCreator from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/resizable/ResizableCreator.vue'
import ImageContextMenu from './ImageContextMenu.vue'

export default Vue.extend({
  name: `DragAndDropImageContainer`,
  effector: {
    $mainImage,
    $mainImageUploading,
    $hideDragAndDropControls,
    $mainImageSize,
    $scale,
    $canCreateResizableBlock,
  },
  components: {
    ResizableCreator,
    DraggableImages,
    DraggableInputs,
    Spinner,
    FilePicker,
    ImageContextMenu,
    FormLabel,
    BaseButton,
  },
  computed: {
    scaledSizes() {
      if (!this.$mainImageSize) {
        return 0
      }
      return {
        width: `${this.$mainImageSize.width * this.$scale}px`,
        height: `${this.$mainImageSize.height * this.$scale}px`,
      }
    },
  },
  methods: {
    setNextResizerToImage,
    setNextResizerToText,
    createResizableBlock,
    resetNextResizableBlock() {
      setNextResizableBlockType(null)
    },
    uploadMainImage,
    saveContainerWidth() {
      const el = this.$el
      if (el) {
        setContainerWidth(el.clientWidth)
      }
    },
    addInput,
    addDroppableImage,
  },
  mounted() {
    window.addEventListener('resize', this.saveContainerWidth)
    this.saveContainerWidth()
  },
  destroyed() {
    window.removeEventListener('resize', this.saveContainerWidth)
    setContainerWidth(0)
  },
})
</script>

<style scoped>
.drag-and-drop-image-container {
  position: relative;
}

.placeholder {
  background: var(--c-grey-5);
  width: 100%;
  height: 90px;
  color: var(--base-text-secondary);
  cursor: pointer;
  @mixin flex-center;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.add-image {
  margin: 0 10px;
}

.actions {
  display: flex;
  align-items: center;
}

.button {
  padding: 3px 10px;
  font-size: 14px;
  font-weight: normal;
  height: auto;
}

.drag-and-drop-image {
  background: var(--c-grey-5);
  border: 1px dashed var(--c-grey-3);
  box-sizing: border-box;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.background-image-wrapper {
  position: relative;
}

.background-image {
  background: #eee;
  width: auto;
  max-width: 100%;
  height: auto;
}
</style>
