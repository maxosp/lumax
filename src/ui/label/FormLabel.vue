<template>
  <div class="form-label">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: `FormLabel`,
})
</script>

<style lang="scss" scoped>
.form-label {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
}
</style>
