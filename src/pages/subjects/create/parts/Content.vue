<template>
  <Block class="content">
    <LeftBlock />
    <RightBlock />
  </Block>
</template>

<script lang="ts">
import Vue from 'vue'
import Block from '@/pages/common/Block.vue'
import LeftBlock from '@/pages/subjects/create/parts/LeftBlock.vue'
import RightBlock from '@/pages/subjects/create/parts/RightBlock.vue'

export default Vue.extend({
  components: { Block, LeftBlock, RightBlock },
})
</script>

<style scoped>
.content {
  display: flex;
  margin-top: 20px;
  padding: 30px;
}
</style>