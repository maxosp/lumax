<template>
  <div
    class="pagination-btn"
    @click="$emit('go-to-prev-page')"
  >
    <Icon
      type="pagination-left"
      class="icon-pagination"
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

