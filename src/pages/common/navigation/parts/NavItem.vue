<template>
  <div class="nav-item">
    <Icon
      :type="`${isCollapsed ? $props.item.icon : `${$props.item.icon}-selected`}`"
      size="30"
    />
    <div v-if="$props.opened" class="content">
      <div class="header" @click="changeCollapsState">
        <div class="title">{{ $props.item.title }}</div>
        <Icon
          v-if="$props.item.children"
          type="chevron-down"
          size="10"
        />
        <div v-else />
      </div>
      <div v-if="!isCollapsed" class="nav-children">
        <NavChild
          v-for="child in $props.item.children"
          :key="child.title"
          :item="child"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import NavChild from '@/pages/common/navigation/parts/NavChild.vue'
import { $openedItem, changeOpenedItem } from '@/pages/common/navigation/navigation.model.ts'
import { NavItem } from '@/pages/common/navigation/types'

export default Vue.extend({
  name: 'NavItem',
  components: { Icon, NavChild },
  effector: {
    $openedItem,
  },
  props: {
    item: { type: Object as PropType<NavItem>, required: true },
    opened: { type: Boolean, required: true },
  },
  computed: {
    isCollapsed() {
      // @ts-ignore
      return !this.$props.opened || this.$openedItem !== this.$props.item.id
    },
  },
  methods: {
    changeCollapsState() {
      if (!this.$props.opened) return
      // @ts-ignore
      if (this.$openedItem === this.$props.item.id) {
        changeOpenedItem(null)
      } else {
        changeOpenedItem(this.$props.item.id)
      }
    },
  },
})
</script>

<style scoped>
.nav-item {
  padding-bottom: 15px;
  display: flex;
  align-items: flex-start;
  white-space: nowrap;
}

.content {
  display: flex;
  flex-direction: column;
  padding-left: 15px;
  flex-basis: 100%;
}

.header {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 7px;
  flex-basis: 100%;
}

.title {
  color: var(--base-text-primary);
  font-weight: 600;
}

.filled /deep/ path {
  fill: var(--c-yellow-1) !important;
}
</style>


