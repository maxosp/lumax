<template>
  <!-- <div
    class="select-item"
    :class="{active, '--sub': subTitle}"
    v-on="$listeners"
  >
    <slot />
    <Icon
      v-if="withIcon"
      type="tick"
      size="16"
      class="icon"
    />
  </div> -->
  <li
    class="select-item"
    :class="{active}"
  >
    <span
      :style="indent"
      @click="handleClick(item)"
    >
      {{ item.title }}
    </span>
    <Icon
      v-if="withIcon"
      type="tick"
      size="16"
      class="icon"
    />
    <ul
      v-if="item.leaves && item.leaves.length"
      class="sub-folders"
    >
      <SelectItemRecursive
        v-for="(child, index) in item.leaves"
        :key="index"
        :level="index"
        :depth="depth + 1"
        :item="child"
        :handle-click="handleClick"
      />
    </ul>
  </li>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import { TreeData } from '@/features/api/types'

export default Vue.extend({
  name: 'SelectItemRecursive',
  components: {
    Icon,
  },
  props: {
    item: {
      type: Object as PropType<{ id: number; leaves: TreeData[]; name: string; title: string }>,
    },
    active: { type: Boolean as PropType<boolean> },
    withIcon: { type: Boolean as PropType<boolean> },
    depth: { type: Number as PropType<number> },
    handleClick: { type: Function as PropType<object> },
  },
  computed: {
    indent() {
      if (this.depth === 0) return { paddingLeft: '20px' }
      return { paddingLeft: `${this.depth * 50}px` }
    },
  },
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
li {
  list-style: none;
}
.select-item span {
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

  &.--sub {
    padding-left: 60px;
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


