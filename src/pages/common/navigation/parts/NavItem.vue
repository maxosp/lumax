<template>
  <div class="nav-item">
    <Icon :type="$props.item.icon" size="30" />
    <div v-if="$isOpened" class="content">
      <div class="title">{{ $props.item.title }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import { $isOpened } from '@/pages/common/Navigation/navigation.model.ts'
import { NavItem } from '@/pages/common/Navigation/types'

export default Vue.extend({
  name: 'NavItem',
  components: { Icon },
  effector: {
    $isOpened,
  },
  props: {
    item: { type: Object as PropType<NavItem>, required: true },
  },
  data: () => ({
    collapsed: false,
  }),
  computed: {
    isCollapsed() {
      // @ts-ignore
      return this.$isOpened && this.collapsed
    },
  },
})
</script>

<style scoped>
.sidebar {
  background-color: #fff;
}
.page-nav {
  padding: 20px;
  width: 60px;
  transition: width var(--base-animation);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.opened {
  width: 240px;
}
</style>


