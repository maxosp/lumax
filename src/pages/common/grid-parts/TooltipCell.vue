<template>
  <div :id="`cell-${$props.rowId}`">
    <span v-if="$props.title.length <= 30">{{ $props.title }}</span>
    <WithTooltip
      v-else
      position="top"
      class="tooltip"
      show-on="mouseenter"
      hide-on="mouseleave"
    >
      <template #activator>
        <span>{{ `${$props.title.slice(0,30)}...` }}</span>
      </template>
      <template #tooltip-content>
        <span>{{
          $props.title > 250
            ? `${$props.title.slice(0,250)}...`
            : $props.title }}
        </span>
      </template>
    </WithTooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import WithTooltip from '@/ui/tooltip/WithTooltip.vue'

export default Vue.extend({
  name: 'TooltipCell',
  components: {
    WithTooltip,
  },
  props: {
    title: { type: String, required: true },
    rowId: { type: Number, required: true },
  },
  methods: {
    handleRightClick(event: any) {
      event.preventDefault()
      this.$emit('onRightClick', { data: { id: this.$props.rowId }, event })
    },
  },
  mounted() {
    const container = document.querySelector(`#cell-${this.$props.rowId}`)
    container && container.addEventListener('contextmenu', this.handleRightClick)
  },
  beforeDestroy() {
    const container = document.querySelector(`#cell-${this.$props.rowId}`)
    container && container.removeEventListener('contextmenu', this.handleRightClick)
  },
})
</script>

<style scoped>
.tooltip {
  & /deep/ .tooltip {
    background-color: var(--tooltip-bg-color);
    color: #fff;
    font-weight: 600;
    line-height: 14px;
    padding: 15px;
    max-width: 300px;
    white-space: break-spaces;
  }
  & /deep/ .menu-wrap {
    min-width: max-content;
    width: auto;
  }
  & /deep/ .arrow {
    display: none;
  }
}
</style>
