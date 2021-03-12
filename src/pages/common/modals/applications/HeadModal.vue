<template>
  <div class="head">
    <p class="title">{{ title }}</p>
    <Icon
      type="close"
      class="modal-icon"
      size="12"
      @click="$emit('close')"
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
    title: { type: String as PropType<string>, default: '' },
  },
})
</script>

<style scoped>
.head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.title {
  font-size: 18px;
  line-height: 22px;
  margin-right: 70px;
}
.modal-icon {
  cursor: pointer;
  margin-top: 4px;
}
</style>
