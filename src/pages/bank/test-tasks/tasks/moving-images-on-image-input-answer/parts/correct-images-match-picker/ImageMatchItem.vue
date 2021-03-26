<template>
  <div class="image-match-item">
    <div class="image-column">
      <img :src="image.image" class="image">
      <div class="name">
        {{image.image}}
      </div>
    </div>
    <div class="actions">
      <div v-if="!droppableImages.length">
        Добавьте изображения выше
      </div>
      <BaseDropdown
        v-else
        class="dropdown"
        placeholder="Нет соответсвий"
        :value="image.value ? `A${image.value}` : null"
        read-only-dropdown
      >
        <template #default="{closeMenu}">
          <SelectItem
            v-for="droppable in droppableImages"
            :key="droppable.value"
            :placeholder="droppable.value"
            class="select-item"
            @click="pickValue(droppable, image); closeMenu(null)"
          >
            A{{ droppable.value }}
          </SelectItem>
        </template>
      </BaseDropdown>
      <SizeInput
        class="change-size"
        :size="image.size"
        @change="$emit('change', {
          ...image,
          size: $event,
        })"
      />
      <Icon
        class="remove-icon"
        size="12px"
        type="close"
        @click="$emit('remove', image)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  DraggableImage,
  DroppableImage,
  MovingOnTextDroppableImage,
} from '@/pages/bank/test-tasks/tasks/types'
import SizeInput from '@/pages/bank/test-tasks/tasks/moving-images-on-image-input-answer/parts/drag-and-drop-image-container/SizeInput.vue'

export default Vue.extend({
  name: `ImageMatchItem`,
  components: {
    SizeInput,
    BaseDropdown,
    SelectItem,
    Icon,
  },
  props: {
    droppableImages: {
      type: Array as PropType<(DroppableImage | MovingOnTextDroppableImage)[]>,
      required: true,
    },
    image: {
      type: Object as PropType<DraggableImage>,
      required: true,
    },
  },
  methods: {
    pickValue(droppable: DroppableImage, image: DraggableImage) {
      this.$emit('change', {
        ...image,
        value: droppable.value,
      })
    },
  },
})
</script>

<style scoped>
.image-match-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  width: 100%;
}
.image-column,
.actions {
  width: 40%;
  flex-basis: 40%;
  display: flex;
  align-items: center;
  position: relative;
}
.actions {
  width: 60%;
  flex-basis: 60%;
}
.image {
  background: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  height: 30px;
  width: 30px;

  filter: drop-shadow(0px 4px 14px rgba(0, 0, 0, 0.15));
  border-radius: 5px;
  margin-right: 15px;
}
.name {
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  color: var(--base-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;
}
.actions {
  justify-content: space-between;
}
.change-size {
  margin-top: 5px;
}
.dropdown {
  width: 170px;
  & ::v-deep {
    .inner-input {
      height: 30px;
    }
    .icon-wrap {
      height: 30px;
      right: 13px;
    }
  }
}
.remove-icon {
  cursor: pointer;
  fill: var(--c-grey-3);
}
</style>
