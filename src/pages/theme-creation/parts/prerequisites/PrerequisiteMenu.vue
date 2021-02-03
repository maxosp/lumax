<template>
  <div class="project-menu">
    <WithTooltip
      ref="tooltip"
      class="tooltip"
      position="right"
    >
      <template #tooltip-content>
        <div class="menu-items">
          <div
            class="menu-item"
            @click.prevent="openNewTab"
          >
            Открыть в новой вкладке
          </div>
        </div>
      </template>
    </WithTooltip>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import WithTooltip from '@/ui/tooltip/WithTooltip.vue'

export default Vue.extend({
  name: 'PrerequisiteMenu',
  components: {
    WithTooltip,
  },
  props: {
    prerequisiteId: { type: Number as PropType<number> },
  },
  data: () => ({
    opened: false,
  }),
  methods: {
    toggleOpened() {
      this.opened = !this.opened
    },
    openNewTab() {
      // TO DO
      // window.open(``, '_blank')
    },
  },
})
</script>

<style scoped>
.tooltip {
  z-index: unset;
}
.menu-item {
  display: block;
  font-size: 14px;
  font-weight: 600;
  line-height: 14px;
  padding: 20px;
  color: var(--base-text-primary);
  cursor: pointer;
  text-decoration: none;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>


