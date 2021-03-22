<template>
  <div
    v-if="showPaginationBtn(index)"
    class="pagination-btn"
    :class="{'--active': selectedPage === index, '--first': showDots('first'), '--last': showDots('last')}"
    v-on="{
      ...$listeners,
      click: (e) => $emit('change-page', index),
    }"
  >
    {{ index }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    index: { type: Number, default: 1 },
    pages: { type: Number, default: 1 },
    selectedPage: { type: Number, default: null },
  },
  methods: {
    showPaginationBtn(index: number): boolean {
      return (
        index === 1 ||
        index === this.pages ||
        index === this.selectedPage ||
        Math.abs(this.selectedPage - index) === 1
      )
    },
    showDots(position: string): boolean {
      const order = position === 'first' ? 1 : this.pages
      return (
        this.pages >= 4 &&
        this.index === order &&
        this.index !== this.selectedPage &&
        Math.abs(this.selectedPage - this.index) >= 3
      )
    },
  },
})
</script>

