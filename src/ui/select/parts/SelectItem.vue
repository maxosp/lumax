<template>
  <div
    class="select-item"
    :style="`height: ${selectItemHeight}px`"
    v-on="$listeners"
  >
    <slot />
    <Icon
      v-if="withIcon"
      type="tick"
      size="16"
      class="icon"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import { selectItemHeight } from '@/pages/common/constants'

export default Vue.extend({
  name: 'SelectItem',
  components: {
    Icon,
  },
  props: {
    active: { type: Boolean as PropType<boolean> },
    withIcon: { type: Boolean as PropType<boolean> },
    subTitle: { type: Boolean as PropType<boolean> },
  },
  data: () => ({
    selectItemHeight,
  }),
})
</script>

<style scoped>
* {
  --side-padding: 20px;
  --bg-color: transparent;
  --bg-hover-color: var(--c-grey-7);
  --bg-active-color: var(--bg-hover-color);
  --text-color: var(--base-text-primary);
  --border-color: var(--c-grey-6);
}

.select-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 51px;
  padding: 0 var(--side-padding);
  font-size: 14px;
  color: var(--text-color);
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--base-animation);
  cursor: pointer;
  &:hover {
    background-color: var(--bg-hover-color);
  }
  .icon {
    stroke: var(--base-text-primary);
    fill: transparent;
  }
  &:after {
    position: absolute;
    content: '';
    width: 4px;
    top: -1px;
    bottom: -1px;
    right: 0;
    background-color: transparent;
    transition: background-color var(--base-animation);
  }
}
</style>


