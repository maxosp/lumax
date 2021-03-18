<template>
  <div class="file-element">
    <div class="preview" :style="{ backgroundImage: `url(${image})` }" />
    <p class="name-file">name file</p>
    <Icon
      type="close"
      class="close-icon"
      size="12"
      @click="$emit('delete')"
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
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 15px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.2);
  }
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