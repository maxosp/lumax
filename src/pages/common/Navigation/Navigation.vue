<template>
  <div class="sidebar">
    <Divider />
    <div :class="{ 'page-nav': true, opened: $isOpened }" @click="changeNavState(!$isOpened)">
      Навигация
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Divider from '@/ui/divider/Divider.vue'
import { $isOpened, changeNavState } from '@/pages/common/Navigation/navigation.model.ts'

export default Vue.extend({
  name: 'Navigation',
  components: { Divider },
  effector: {
    $isOpened,
  },
  methods: {
    changeNavState,
  },
})
</script>

<style scoped>
.sidebar {
  background-color: #fff;
}
.page-nav {
  padding: 20px;
  width: 60px;
  transition: width var(--base-animation);
}
.opened {
  width: 240px;
}
</style>


