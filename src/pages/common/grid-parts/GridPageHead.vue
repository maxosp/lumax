<template>
  <Block class="header">
    <span class="title">{{ title }}</span>
    <slot />
  </Block>
</template>

<script lang="ts">
import Vue from 'vue'
import Block from '@/pages/common/Block.vue'

export default Vue.extend({
  name: 'PageHeader',
  components: { Block },
  props: {
    title: {
      type: String,
      default: '',
    },
  },
})
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 20px;
  height: 58px;
}

.title {
  color: var(--base-text-primary);
  font-size: 20px;
  font-weight: bold;
}
</style>
