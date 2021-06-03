<template>
  <li
    class="select-item"
    :class="{active}"
  >
    <span
      :style="indent"
      @click="handleClick(item)"
    >
      {{ item.title }}
      <Icon
        v-if="showTick"
        type="tick"
        size="16"
        class="icon"
      />
    </span>
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
        :selected-item-id="selectedItemId"
        :selected-items-ids="selectedItemsIds"
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
    selectedItemId: { type: Number as PropType<number> },
    selectedItemsIds: { type: Array as PropType<number[]> },
    handleClick: { type: Function },
  },
  computed: {
    indent() {
      return { paddingLeft: `${(this.depth + 1) * 20}px` }
    },
    showTick() {
      if (this.selectedItemsIds && this.selectedItemsIds.find((el: any) => el.id === this.item.id))
        return true
      if (this.selectedItemId && this.selectedItemId === this.item.id) return true
      return false
    },
  },
  mounted() {
    console.log(this)
  },
})
</script>

<style scoped>
* {
  --side-padding: 40px;
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
  min-height: 51px;
  padding: 16px var(--side-padding);
  font-size: 14px;
  line-height: 20px;
  color: var(--text-color);
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--base-animation);
  cursor: pointer;
  position: relative;
  &:hover {
    background-color: var(--bg-hover-color);
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
  .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
    stroke: var(--base-text-primary);
    fill: transparent;
  }
}
</style>


