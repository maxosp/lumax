<template>
  <div :id="`cell-${$props.rowId}`">
    <span v-if="$props.title.length <= 30">{{ $props.title }}</span>
    <div v-else>
      <span v-tooltip.top-end="options">
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
    const container = document.querySelector(`#cell-${this.$props.rowId}`)
    container && container.addEventListener('contextmenu', this.handleRightClick)
  },
  beforeDestroy() {
    const container = document.querySelector(`#cell-${this.$props.rowId}`)
    container && container.removeEventListener('contextmenu', this.handleRightClick)
  },
})
</script>
