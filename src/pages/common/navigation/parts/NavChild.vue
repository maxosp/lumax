<template>
  <RouterLink
    :to="{name: item.link}"
    :class="{ 'nav-child': true, selected: isSelected }"
  >
    <div class="title">{{ item.title }}</div>
    <div
      v-if="isIncomingApplication"
      class="counter"
    >
      ({{ counterValue }})
    </div>
  </RouterLink>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { NavItemChild } from '@/pages/common/navigation/types'
import {
  $incomingApplicationsCounter,
  $incomingDeletionApplicationsCounter,
} from '@/pages/common/navigation/navigation.model'

export default Vue.extend({
  name: 'NavChild',
  props: {
    item: { type: Object as PropType<NavItemChild>, required: true },
  },
  effector: {
    $incomingApplicationsCounter,
    $incomingDeletionApplicationsCounter,
  },
  computed: {
    isSelected(): boolean {
      return this.item.link === this.$route.name
    },
    isIncomingApplication(): boolean {
      return (
        this.item.type === 'incoming-applications' ||
        this.item.type === 'incoming-deletion-applications'
      )
    },
    counterValue(): number {
      return this.item.type === 'incoming-applications'
        ? this.$incomingApplicationsCounter
        : this.$incomingDeletionApplicationsCounter
    },
  },
})
</script>

<style scoped>
.nav-child {
  cursor: pointer;
  margin-top: 10px;
  padding: 5px 0;
  margin-left: 45px;
  display: flex;
  align-items: flex-start;
  white-space: normal;
  color: var(--base-text-secondary);
  &:hover {
    @mixin underline-text;
  }
}
.selected {
  font-weight: 600;
  color: var(--base-text-primary);
}
.counter {
  margin-left: 4px;
}
</style>


