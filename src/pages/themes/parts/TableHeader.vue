<template>
  <div class="header">
    <span>{{ totalTitle }}</span>
    <BaseSwitch
      :checked="$treeView"
      @change="toggleTreeView"
    >
      <p>Дерево</p>
    </BaseSwitch>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import { toggleTreeView, $treeView } from '@/pages/themes/themes-page.model'

export default Vue.extend({
  name: 'TableHeader',
  components: {
    BaseSwitch,
  },
  effector: {
    $treeView,
  },
  props: {
    total: { type: Number, required: true },
  },
  computed: {
    totalTitle() {
      // @ts-ignore
      if (this.$treeView) return ''

      let title = 'тем'
      const lastDigit = `${this.$props.total}`.slice(-1)
      if (lastDigit === '1') {
        title = 'тема'
      } else if (['2', '3', '4'].includes(lastDigit)) {
        title = 'темы'
      }
      return `${this.$props.total} ${title}`
    },
  },
  methods: {
    toggleTreeView,
  },
})
</script>

<style scoped>
.header {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  background-color: #fff;
  color: var(--base-text-primary);
  font-size: 16px;
  line-height: 16px;
  border-bottom: 1px solid var(--c-grey-9);
}
</style>
