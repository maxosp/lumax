<template>
  <div class="areas-for-attaching-images">
    <FormLabel class="title">Области для прикрепления изображений</FormLabel>

    <div class="table">

      <div class="row">
        <div class="cell header-cell">
          Номер области
        </div>

        <div class="cell header-cell">
          Правильный ответ
        </div>

        <div class="cell header-cell">
          Размер
        </div>

        <div class="cell header-cell color-cell">
          Цвет
        </div>
      </div>

      <AttachingImagesItem />
      <AttachingImagesItem />
      <AttachingImagesItem />

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FormLabel from '@/ui/label/FormLabel.vue'
import AttachingImagesItem from './AttachingTextItem.vue'

export default Vue.extend({
  name: `AreasForAttachingText`,
  components: {
    FormLabel,
    AttachingImagesItem,
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
.header-cell {
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  padding-bottom: 8px;
}
</style>
