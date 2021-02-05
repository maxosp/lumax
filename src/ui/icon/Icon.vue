<template>
  <svg
    class="no-select"
    :viewBox="viewBox"
    :width="size"
    :height="size"
    v-on="$listeners"
  >
    <use
      :href="spritepath"
      :xlink:href="spritepath"
    />
  </svg>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

let Sprite = ''

if (process.env.NODE_ENV === 'production') {
  Sprite = require('@/assets/icons/sprite.svg')
}

export default Vue.extend({
  props: {
    size: { type: String as PropType<string>, default: '24px' },
    viewBox: { type: String as PropType<string>, default: '0 0 64 64' },
    type: { type: String as PropType<string>, required: true },
  },
  data: () => ({
    sprite: Sprite,
  }),

  computed: {
    spritepath() {
      return `${Sprite}#${this.type}-icon`
    },
  },
})
</script>

<style scoped>
.no-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  outline: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>


