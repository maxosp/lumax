<template>
  <div class="divider" :style="getStyles()" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'Divider',
  props: {
    vertical: { type: Boolean as PropType<boolean>, required: false },
  },
  methods: {
    getStyles() {
      if (this.$props.vertical) {
        return {
          width: '1px',
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
  height: 40px;
}
</style>


