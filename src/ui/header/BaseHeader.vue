<template>
  <div class="base-header">
    <div class="left-section">
      <slot name="left" />
      <Divider vertical />
    </div>
    <div class="center-section">
      <slot name="center" />
    </div>
    <div class="right-section">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Divider from '@/ui/divider/Divider.vue'

export default Vue.extend({
  name: 'BaseHeader',
  components: { Divider },
})
</script>

<style scoped>
.base-header {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  height: 60px;
}

.center-section {
  display: flex;
  flex-basis: 100%;
}

.left-section,
.right-section {
  display: flex;
  align-items: center;
  padding-right: 30px;
  box-sizing: border-box;
}
</style>


