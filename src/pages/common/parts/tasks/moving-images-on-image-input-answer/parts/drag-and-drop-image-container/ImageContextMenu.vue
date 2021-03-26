<template>
  <div
    class="image-context-menu"
    :style="styles"
    @mousedown.stop=""
  >
    <div class="title">
      Размер
    </div>
    <SizeInput
      :size="size"
      class="row"
      @change="changeSize"
    />

    <div class="title">
      Координаты
    </div>
    <div class="row">
      <BaseInput
        :value="position.x"
        type="number"
        class="size image-x"
        @input="changePosition({
          x: $event,
        })"
      />
      x
      <BaseInput
        :value="position.y"
        type="number"
        class="size image-y"
        @input="changePosition({
          y: $event,
        })"
      />
    </div>

    <div class="title">
      Цвет
    </div>
    <div class="row">
      <ColorPicker :color="color" @change="changeColor" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseInput from '@/ui/input/BaseInput.vue'
import { Position, Size } from '@/pages/common/parts/tasks/types'
import SizeInput from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/SizeInput.vue'
import ColorPicker from '@/pages/common/parts/tasks/moving-images-on-text-input-answer/parts/areas-for-attaching-images/ColorPicker.vue'

export default Vue.extend({
  name: `ImageContextMenu`,
  components: {
    ColorPicker,
    SizeInput,
    BaseInput,
  },
  props: {
    cords: {
      type: Object as PropType<Position>,
      required: true,
    },
    size: {
      type: Object as PropType<Size>,
      required: true,
    },
    position: {
      type: Object as PropType<Position>,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  computed: {
    styles() {
      return {
        top: `${this.cords.y}px`,
        left: `${this.cords.x}px`,
      }
    },
  },
  methods: {
    changeSize(value: Size) {
      this.$emit('changeSize', value)
    },
    changeColor(value: string) {
      this.$emit('changeColor', value)
    },
    changePosition(value: Partial<Position>) {
      this.$emit('changePosition', {
        ...this.position,
        ...value,
      })
    },
  },
})
</script>

<style scoped>
.image-context-menu {
  position: fixed;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.15);
  border-radius: 7px;
  z-index: 1;
  z-index: 200;
}
.title {
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  color: var(--base-text-primary);
  margin-bottom: 10px;
}
.row {
  font-size: 14px;
  line-height: 17px;
  color: var(--base-text-primary);
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.size {
  width: 70px;
  height: 30px;
  background: var(--c-grey-5);
  border: 1px solid var(--c-grey-6);
  box-sizing: border-box;
  border-radius: 5px;
  font-size: inherit;
  font-family: inherit;
}
.image-x {
  margin-right: 19px;
}
.image-y {
  margin-left: 19px;
}
</style>
