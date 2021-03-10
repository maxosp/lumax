<template>
  <div class="header">
    <div class="left">
      <span>{{ total | formatThemeTitle }}</span>
      <Divider
        v-if="selectedRows.length"
        vertical
        height="25px"
        class="divider"
      />
      <span
        v-if="selectedRows && selectedRows.length === 1"
        class="--basic"
        @click="$emit('onEdit', selectedRows)"
      >
        Редактировать
      </span>
      <span
        v-if="selectedRows.length"
        class="--red"
        @click="handleRemove"
      >
        Удалить
      </span>
    </div>
    <BaseSwitch
      :checked="$treeView"
      @change="toggleTreeView"
    >
      <p>Дерево</p>
    </BaseSwitch>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import { toggleTreeView, $treeView } from '@/pages/bank/test-tasks/list/tasks-page.model'
import Divider from '@/ui/divider/Divider.vue'

export default Vue.extend({
  name: 'TableHeader',
  components: {
    BaseSwitch,
    Divider,
  },
  effector: {
    $treeView,
  },
  props: {
    total: { type: Number, required: true },
    selectedRows: { type: Array as PropType<number[]> },
  },
  methods: {
    toggleTreeView,
    handleRemove() {
      const data = this.selectedRows?.length > 1 ? this.selectedRows : this.selectedRows[0]
      this.$emit('onRemove', data)
    },
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
  .left {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .divider {
    background-color: var(--c-grey-15);
    margin: 0 25px;
  }
  span {
    cursor: pointer;
  }
  span.--basic {
    margin-right: 25px;
  }
  span.--red {
    color: var(--c-red-1);
  }
}
</style>
