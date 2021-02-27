<template>
  <div :id="`cell-${$props.rowId}`">
    <span v-if="$props.title.length <= 30">{{ $props.title }}</span>
    <div v-else>
      <span v-tooltip.top-end="options" class="activator">
        {{ `${$props.title.slice(0,30)}...` }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TooltipCell',
  props: {
    title: { type: String, required: true },
    rowId: { type: Number, required: true },
  },
  computed: {
    options() {
      return {
        content: this.title.length > 250 ? `${this.title.slice(0, 250)}...` : this.title,
        offset: '6',
      }
    },
  },
  methods: {
    handleRightClick(event: any) {
      event.preventDefault()
      this.$emit('onRightClick', { data: { id: this.$props.rowId }, event })
    },
  },
  mounted() {
    // @ts-ignore
    const container = document.querySelector(`#cell-${this.$props.rowId}`)
    // @ts-ignore
    container && container.addEventListener('contextmenu', this.handleRightClick)
  },
  beforeDestroy() {
    // @ts-ignore
    const container = document.querySelector(`#cell-${this.$props.rowId}`)
    // @ts-ignore
    container && container.removeEventListener('contextmenu', this.handleRightClick)
  },
})
</script>
