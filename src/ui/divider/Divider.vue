<template>
  <div class="divider" :style="getStyles()" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'Divider',
  props: {
    vertical: { type: Boolean as PropType<boolean>, required: false },
    height: { type: String as PropType<string>, required: false, default: '60px' },
  },
  methods: {
    getStyles() {
      if (this.$props.vertical) {
        return {
          width: '1px',
          height: this.$props.height,
        }
      }

      return {
        width: '100%',
        height: '1px',
      }
    },
  },
})
</script>

<style scoped>
.divider {
  background-color: var(--c-grey-4);
}
</style>


