<template>
  <div class="select-menu">
    <ScrollContainer :max-height="255">
      <slot />
    </ScrollContainer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ScrollContainer from '@/ui/scroll-container/ScrollContainer.vue'

export default Vue.extend({
  name: 'SelectMenu',
  components: {
    ScrollContainer,
  },
})
</script>

<style scoped>
* {
  --bg-color: white;
}
.select-menu {
  background-color: var(--bg-color);
  border-radius: 7px;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}
</style>


