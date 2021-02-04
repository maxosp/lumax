<template>
  <div class="sidebar">
    <Divider />
    <div :class="{ 'navigation': true, opened: $isOpened }">
      <NavItem
        v-for="item in navItems"
        :key="item.title"
        :item="item"
        :opened="$isOpened"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Divider from '@/ui/divider/Divider.vue'
import NavItem from '@/pages/common/navigation/parts/NavItem.vue'
import { $isOpened } from '@/pages/common/navigation/navigation.model.ts'
import { data as navItems } from '@/pages/common/navigation/data'

export default Vue.extend({
  name: 'Navigation',
  components: { Divider, NavItem },
  effector: {
    $isOpened,
  },
  data: () => ({
    navItems,
  }),
})
</script>

<style scoped>
.sidebar {
  background-color: #fff;
}
.navigation {
  padding: 20px;
  width: 70px;
  transition: width var(--base-animation);
  display: flex;
  flex-direction: column;
}
.opened {
  width: 240px;
}
</style>


