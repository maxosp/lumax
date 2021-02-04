<template>
  <div class="nav-child">
    {{ $props.item.title }}
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { NavItemChild } from '@/pages/common/navigation/types'

export default Vue.extend({
  name: 'NavChild',
  props: {
    item: { type: Object as PropType<NavItemChild>, required: true },
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
</style>


