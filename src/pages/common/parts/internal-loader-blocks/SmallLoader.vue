<template>
  <div class="loading-wrapper">
    Загрузка...
    <InternalLoader />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InternalLoader from '@/pages/common/parts/loader/InternalLoader.vue'

export default Vue.extend({
  components: { InternalLoader },
})
</script>

<style scoped>
.loading-wrapper {
  @mixin flex-row-central;
  & ::v-deep .spinner {
    margin-left: 10px;
    width: 14px;
    height: 14px;
    &::after {
      display: none;
    }
  }
}
</style>
