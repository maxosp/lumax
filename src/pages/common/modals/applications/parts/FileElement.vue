<template>
  <div class="file-element">
    <div class="preview">
      <img
        :src="image"
        class="preview-image"
        alt="comment image"
      >
    </div>
    <p class="name-file">name file</p>
    <Icon
      type="close"
      class="close-icon"
      size="12"
      @click="$emit('delete', id)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  name: 'ModalLogout',
  components: { Icon },
  props: {
    name: { type: String as PropType<string>, default: '' },
    image: { type: String as PropType<string>, default: '' },
    id: { type: Number as PropType<number> },
  },
})
</script>

<style scoped>
.file-element {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.preview {
  width: 30px;
  height: 30px;
  margin-right: 15px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
}
.preview-image {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 100%;
  max-width: 100%;
  filter: brightness(0.8);
  object-fit: contain;
}
.name-file {
  font-weight: bold;
  font-size: 14px;
}
.close-icon {
  cursor: pointer;
  margin-left: auto;
  fill: var(--c-grey-3);
}
</style>
