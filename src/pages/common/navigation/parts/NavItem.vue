<template>
  <div class="nav-item">
    <div class="content">
      <div
        class="header"
        @click="changeCollapseState"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <div class="left">
          <Icon
            :type="iconType"
            size="30"
          />
          <div v-if="opened" class="title">{{ item.title }}</div>
        </div>
        <div v-if="opened" class="right">
          <div
            v-if="item.type === 'applications'"
            class="tickets-counter"
          >
            {{ $totalApplicationsCounter }}
          </div>
          <Icon
            v-if="item.children"
            type="chevron-down"
            class="tile-chevron"
            :class="{ uncollapsed: !isCollapsed, icon: true }"
            size="10"
          />
          <div v-else />
        </div>
      </div>
      <div v-if="!isCollapsed" class="nav-children">
        <NavChild
          v-for="child in item.children"
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
import {
  $openedItem,
  $totalApplicationsCounter,
  changeOpenedItem,
} from '@/pages/common/navigation/navigation.model'
import { NavItem } from '@/pages/common/navigation/types'

export default Vue.extend({
  name: 'NavItem',
  components: { Icon, NavChild },
  effector: {
    $openedItem,
    $totalApplicationsCounter,
  },
  props: {
    item: { type: Object as PropType<NavItem>, required: true },
    opened: { type: Boolean, required: true },
  },

  data: () => ({
    isHovered: false,
  }),
  computed: {
    isCollapsed(): boolean {
      return !this.opened || this.$openedItem !== this.item.id
    },
    iconType(): string {
      if (this.isHovered) return `${this.item.icon}-selected`
      return this.isCollapsed ? this.item.icon : `${this.item.icon}-selected`
    },
  },
  methods: {
    changeCollapseState() {
      if (!this.opened) return
      if (this.$openedItem === this.item.id) {
        changeOpenedItem(null)
      } else {
        changeOpenedItem(this.item.id)
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
  flex-basis: 100%;
}

.header {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-basis: 100%;
  &:hover .title {
    color: var(--c-yellow-1);
  }
}

.left,
.right {
  display: flex;
  align-items: center;
}

.title {
  color: var(--base-text-primary);
  font-weight: 600;
  margin-left: 15px;
}

.tickets-counter {
  padding: 3px 8px;
  font-weight: 600;
  color: #fff;
  font-size: 14px;
  line-height: 1;
  border-radius: 40px;
  background-color: var(--c-grey-3);
  margin-left: auto;
  margin-right: 10px;
}

.filled /deep/ path {
  fill: var(--c-yellow-1) !important;
}

.icon {
  stroke: var(--base-text-primary);
}

.uncollapsed {
  transform: rotate(180deg);
}
</style>


