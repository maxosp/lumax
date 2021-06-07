<template>
  <div class="select-menu">
    <ScrollContainer
      :max-height="actionsSelectMenuMaxHeight"
      :loading="loading"
      @infiniteHandler="$emit('infiniteHandler')"
    >
      <slot />
    </ScrollContainer>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import ScrollContainer from '@/ui/scroll-container/ScrollContainer.vue'
import { actionsSelectMenuMaxHeight } from '@/pages/common/constants'

export default Vue.extend({
  name: 'SelectMenu',
  components: {
    ScrollContainer,
  },
  props: {
    loading: { type: Boolean as PropType<boolean> },
  },
  data: () => ({
    actionsSelectMenuMaxHeight,
  }),
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


