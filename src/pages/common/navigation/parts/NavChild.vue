<template>
  <RouterLink
    :to="{name: $props.item.link}"
    :class="{ 'nav-child': true, selected: isSelected }"
  >
    {{ $props.item.title }}
  </RouterLink>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { NavItemChild } from '@/pages/common/navigation/types'

export default Vue.extend({
  name: 'NavChild',
  props: {
    item: { type: Object as PropType<NavItemChild>, required: true },
  },
  computed: {
    isSelected(): boolean {
      return this.$props.item.link === this.$route.name
    },
  },
})
</script>

<style scoped>
.nav-child {
  cursor: pointer;
  padding-top: 20px;
  display: flex;
  align-items: center;
  white-space: normal;
  color: var(--base-text-secondary);
}
.selected {
  font-weight: 600;
  color: var(--base-text-primary);
}
</style>


