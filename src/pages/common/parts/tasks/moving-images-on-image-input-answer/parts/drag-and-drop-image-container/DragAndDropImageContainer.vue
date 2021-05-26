<template>
  <div class="drag-and-drop-image-container">
    <ImageContextMenu v-if="false" />
    <div class="header">
      <FormLabel>Фоновое изображение</FormLabel>
      <div class="actions">
        <template v-if="!$hideDragAndDropControls">
          <BaseButton class="button" @click="triggerInputFile">Заменить фон</BaseButton>
          <BaseButton class="add-image button" @click="setNextResizerToImage">+ изображение</BaseButton>
          <BaseButton class="button" @click="setNextResizerToText">+ текст</BaseButton>
        </template>
      </div>
    </div>
    <div class="drag-and-drop-image">
      <Spinner v-if="$mainImageUploading" full />
      <FilePicker
        :style="$hideDragAndDropControls ? { height: 'auto' } : scaledSizes"
        accept="image/*"
        @change="uploadMainImage"
      >
        <div v-show="$hideDragAndDropControls" class="placeholder">
          Загрузите фоновое изображение или перетащите в поле
        </div>
        <div
          v-if="!$hideDragAndDropControls"
          class="background-image-wrapper"
          :style="scaledSizes"
        >
          <ResizableCreator
            :disabled="!$canCreateResizableBlock"
            :scale="$scale"
            @created="createResizableBlock"
            @unfocused="resetNextResizableBlock"
          />
          <div v-show="!$mainImageUploading">
            <DraggableInputs />
            <DraggableImages />
          </div>
        </div>
        <img
          v-show="!$hideDragAndDropControls && $mainImage"
          :src="$mainImage"
          class="background-image"
          :style="scaledSizes"
        >
      </FilePicker>
    </div>
    <div class="background-image-picker">
      <ImageMatchItem
        v-if="$mainImage"
        :image="{
          size: $mainImageSize,
          image: $mainImage,
          value: 0,
        }"
        :droppable-images="[]"
        is-background-image
        @remove="removeMainImage"
        @change="updateMainImageSizes"
      />
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
  removeMainImage,
  setMainImageSize,
} from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/form/moving-images-on-image-answer-form.model'
import FilePicker from '@/ui/file-picker/FilePicker.vue'
import Spinner from '@/ui/spinner/Spinner.vue'
import DraggableInputs from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/DraggableInputs.vue'
import DraggableImages from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/DraggableImages.vue'
import ResizableCreator from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/resizable/ResizableCreator.vue'
import ImageMatchItem from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/parts/correct-images-match-picker/ImageMatchItem.vue'
import ImageContextMenu from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/ImageContextMenu.vue'
import { DraggableImage } from '@/pages/common/parts/tasks/types'
import { BACKGROUND_IMAGE_SIZE } from '@/pages/common/constants'

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
    ImageMatchItem,
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
    setMainImageSize,
    createResizableBlock,
    removeMainImage,
    uploadMainImage,
    addInput,
    addDroppableImage,
    resetNextResizableBlock() {
      setNextResizableBlockType(null)
    },
    saveContainerWidth() {
      const el = this.$el
      if (el) {
        setContainerWidth(el.clientWidth)
      }
    },
    triggerInputFile() {
      const filePicker = document.getElementById('file-picker')
      filePicker!.click()
    },
    updateMainImageSizes(event: DraggableImage) {
      if (event.size.width <= BACKGROUND_IMAGE_SIZE) setMainImageSize(event.size)
    },
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
}

.background-image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background: #eee;
}

.background-image-picker {
  margin: 20px auto;
}
</style>
