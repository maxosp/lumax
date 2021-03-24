<template>
  <div class="attaching-images-item">
    <div class="cell">
      <FormInput
        :value="answer.systemIndex"
        class="scope-key"
      />
    </div>
    <div class="cell">
      <SizeInput
        :size="answer.size"
        @change="$emit('change', {
          ...answer,
          size: $event,
        })"
      />
    </div>
    <div class="cell">
      <div class="actions">
        <ColorPicker
          :color="answer.color"
          class="color-picker"
          @change="$emit('change', {
            ...answer,
            color: $event,
          })"
        />
        <Icon
          class="remove-icon"
          size="12px"
          type="close"
          @click="$emit('remove', answer)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import FormInput from '@/ui/input/FormInput.vue'
import Icon from '@/ui/icon/Icon.vue'
import SizeInput from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/SizeInput.vue'
import { MovingOnTextDroppableImage } from '@/pages/bank/test-tasks/tasks/types'
import ColorPicker from './ColorPicker.vue'

export default Vue.extend({
  name: `AttachingImagesItem`,
  components: {
    Icon,
    FormInput,
    SizeInput,
    ColorPicker,
  },
  props: {
    answer: {
      type: Object as PropType<MovingOnTextDroppableImage>,
      required: true,
    },
  },
})
</script>

<style scoped>
.attaching-images-item {
  display: table-row;
}
.actions {
  display: flex;
  align-items: center;
}
.cell {
  display: table-cell;
  vertical-align: middle;
  padding-bottom: 10px;
}
.color-picker {
  margin-right: 19px;
}
.scope-key {
  width: 112px;
}
.remove-icon {
  cursor: pointer;
  fill: var(--c-grey-3);
}
</style>
