<template>
  <transition name="fade">
    <ModalOverlay v-if="value">
      <ModalBody
        :title="title"
        @close="$emit('change', false)"
      >
        <slot />
      </ModalBody>
    </ModalOverlay>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'

import ModalOverlay from '@/ui/modal/parts/ModalOverlay.vue'
import ModalBody from '@/ui/modal/parts/ModalBody.vue'

export default Vue.extend({
  name: 'Modal',
  components: {
    ModalOverlay,
    ModalBody,
  },
  props: {
    value: { type: Boolean },
    title: { type: String, default: '' },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
})
</script>



