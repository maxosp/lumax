<template>
  <div :id="`cell-${$props.rowId}`">
    <div
      v-if="title"
      class="contents"
    >
      <span v-if="$props.title.length <= 15">{{ $props.title }}</span>
      <div v-else>
        <span v-tooltip.top-end="options">
          {{ `${$props.title.slice(0,15)}...` }}
        </span>
      </div>
    </div>
    <div
      v-if="iconType"
      class="contents"
    >
      <Icon
        :type="iconType"
        size="20"
        class="icon"
        :class="{'--no-stroke': iconType === 'type-1'}"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  name: 'TooltipCell',
  components: {
    Icon,
  },
  props: {
    title: { type: String },
    rowId: { type: Number, required: true },
    iconType: { type: String },
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

<style scoped>
.icon {
  fill: transparent;
  stroke: var(--c-dark-0);
}
.icon.--no-stroke {
  stroke: transparent;
}
</style>
