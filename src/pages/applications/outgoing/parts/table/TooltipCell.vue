<template>
  <div :id="`cell-${rowId}`">
    <div
      v-if="title"
      class="contents"
    >
      <span v-if="title.length <= 15">{{ title }}</span>
      <div v-else>
        <span v-tooltip.top-end="options">
          {{ `${title.slice(0,15)}...` }}
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
    assignmentId: { type: Number, required: true },
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
      this.$emit('onRightClick', {
        data: { id: this.rowId, test_assignment: { id: this.assignmentId } },
        event,
      })
    },
  },
  mounted() {
    const container = document.querySelector(`#cell-${this.rowId}`)
    container && container.addEventListener('contextmenu', this.handleRightClick)
  },
  beforeDestroy() {
    const container = document.querySelector(`#cell-${this.rowId}`)
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
