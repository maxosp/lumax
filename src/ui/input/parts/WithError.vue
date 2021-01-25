<template>
  <WithTooltip
    position="right"
    corner="center"
    :disabled="disabled"
    show-on="mouseenter"
    hide-on="mouseleave"
  >
    <template #activator>
      <slot />
    </template>

    <template #tooltip-content>
      <slot name="error" />
    </template>
  </WithTooltip>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import WithTooltip from '@/ui/tooltip/WithTooltip.vue'

export default Vue.extend({
  name: 'WithError',
  components: {
    WithTooltip,
  },
  props: {
    disabled: { type: Boolean as PropType<boolean> },
  },

  methods: {},
})
</script>

<style scoped></style>

