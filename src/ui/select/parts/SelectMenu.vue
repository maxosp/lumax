<template>
  <div class="select-menu">
    <ScrollContainer :max-height="155">
      <div class="scroll">
        <slot />
      </div>
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
  --bg-color: #fff;
}
.select-menu {
  background-color: var(--bg-color);
  border-radius: 10px;
  box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.17);
  overflow: hidden;
}
.scroll {
  display: flex;
  flex-direction: column;
  min-height: 155px;
}
</style>


