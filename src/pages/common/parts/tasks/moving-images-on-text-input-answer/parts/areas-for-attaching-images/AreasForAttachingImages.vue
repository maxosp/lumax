<template>
  <div class="areas-for-attaching-images">
    <FormLabel class="title">Области для прикрепления изображений</FormLabel>

    <div class="table">
      <div v-if="$droppableImages.length" class="row">
        <div class="cell header-cell">
          Номер области
        </div>

        <div class="cell header-cell">
          Размер
        </div>

        <div class="cell header-cell color-cell">
          Цвет
        </div>
      </div>
      <div v-else class="instruction">
        Добавьте область для изображения в поле "Текст"
      </div>

      <AttachingImagesItem
        v-for="image in $droppableImages"
        :key="image.id"
        :answer="image"
        @change="replaceDroppableImage"
        @remove="removeDroppableImage"
      />

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FormLabel from '@/ui/label/FormLabel.vue'
import {
  $droppableImages,
  replaceDroppableImage,
  removeDroppableImage,
} from '@/pages/common/parts/tasks/moving-images-on-text-input-answer/form/moving-images-on-text-input-answer-form.model'
import AttachingImagesItem from './AttachingImagesItem.vue'

export default Vue.extend({
  name: `AreasForAttachingImages`,
  components: {
    FormLabel,
    AttachingImagesItem,
  },
  effector: {
    $droppableImages,
  },
  methods: {
    replaceDroppableImage,
    removeDroppableImage,
  },
})
</script>

<style scoped>
.title {
  margin-bottom: 10px;
}
.table {
  display: table;
  width: 100%;
}
.row {
  display: table-row;
}
.color-cell {
  width: 50px;
}
.cell {
  display: table-cell;
}
.instruction {
  @mixin flex-center;
  background: var(--c-grey-5);
  border: 1px solid var(--c-grey-2);
  color: var(--c-grey-3);
  border-radius: 3px;
  padding: 20px;
}
.header-cell {
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  padding-bottom: 8px;
}
</style>
