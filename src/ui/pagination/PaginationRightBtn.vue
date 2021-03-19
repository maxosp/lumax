<template>
  <div
    class="pagination-btn"
    @click="$emit('go-to-next-page')"
  >
    <Icon
      type="pagination-right"
      class="icon-pagination"
      size="18"
      view-box="0 0 11 18"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  components: {
    Icon,
  },
})
</script>

