<template>
  <div class="loader-wrapper">
    <div class="header">
      <SmallLoader />
    </div>
    <div class="big-loader-wrapper">
      <InternalLoader />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InternalLoader from '@/pages/common/parts/loader/InternalLoader.vue'
import SmallLoader from '@/pages/common/parts/internal-loader-blocks/SmallLoader.vue'

export default Vue.extend({
  components: { InternalLoader, SmallLoader },
})
</script>

<style scoped>
.loader-wrapper {
  width: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}
.header {
  width: 100%;
  height: 44px;
  padding: 0 30px;
  background-color: #fff;
  @mixin flex-row-central;
  border-bottom: 1px solid var(--c-grey-9);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.big-loader-wrapper {
  width: 100%;
  min-height: 550px;
  background-color: #fff;
  @mixin flex-row-central;
  justify-content: center;
}
</style>
