<template>
  <div class="modal-body">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ESCAPE_BTN_KEY_CODE } from '@/ui/modal/parts/constants'

export default Vue.extend({
  name: 'ModalBody',
  methods: {
    keydownHandler(e: KeyboardEvent) {
      if (e.keyCode === ESCAPE_BTN_KEY_CODE || e.code === 'Escape') {
        this.close()
      }
    },
    close() {
      this.$emit('close', false)
    },
  },
  mounted() {
    document.addEventListener('keydown', this.keydownHandler)
  },
  destroyed() {
    document.removeEventListener('keydown', this.keydownHandler)
  },
})
</script>

<style scoped>
.modal-body {
  min-width: 340px;
  border-radius: 10px;
  background-color: #fff;
  padding: 40px 60px;
}
</style>


