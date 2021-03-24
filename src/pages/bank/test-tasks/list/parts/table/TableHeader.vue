<template>
  <div class="header">
    <div class="left">
      <span>{{ total | formatTasksTitle }}</span>
      <Divider
        v-if="selectedRows.length"
        vertical
        height="25px"
        class="divider"
      />
      <span
        v-if="selectedRows && selectedRows.length === 1"
        class="--basic"
        @click="$emit('onEdit', selectedRows[0])"
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
      <span
        v-if="showAdditionalActions"
        class="--basic"
        @click="$emit('showPreview', selectedRows[0])"
      >
        Предпросмотр
      </span>
    </div>
    <div class="right">
      <BaseSwitch
        :checked="$treeView"
        @change="toggleTreeView"
      >
        <p>Дерево</p>
      </BaseSwitch>
      <Icon
        type="information"
        size="20"
        class="icon"
        @click="modalTasksTypesVisibilityChanged(true)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import { toggleTreeView, $treeView } from '@/pages/bank/test-tasks/list/tasks-page.model'
import Divider from '@/ui/divider/Divider.vue'
import Icon from '@/ui/icon/Icon.vue'
import { modalTasksTypesVisibilityChanged } from '@/pages/common/modals/tasks-bank/tasks-types/tasks-types-modal.model'

export default Vue.extend({
  name: 'TableHeader',
  components: {
    BaseSwitch,
    Divider,
    Icon,
  },
  effector: {
    $treeView,
  },
  props: {
    total: { type: Number, required: true },
    selectedRows: { type: Array as PropType<number[]> },
  },
  computed: {
    showAdditionalActions() {
      return this.selectedRows.length === 1
    },
  },
  methods: {
    toggleTreeView,
    modalTasksTypesVisibilityChanged,
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
  .right {
    display: flex;
  }
  .right .icon {
    fill: var(--c-grey-3);
    cursor: pointer;
    margin-left: 30px;
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
  span.--basic:last-of-type {
    margin-right: 0;
  }
  span.--red {
    color: var(--c-red-1);
    margin-right: 25px;
  }
}
</style>
