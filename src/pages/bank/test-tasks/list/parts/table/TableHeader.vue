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
        @click="$emit('onRemove', selectedRows)"
      >
        Удалить
      </span>
      <span
        v-if="selectedRows.length"
        class="--basic"
        @click="$emit('onSendToReview', selectedRows)"
      >
        На проверку
      </span>
      <span
        v-if="selectedRows.length"
        class="--basic"
        @click="$emit('onPublish', selectedRows)"
      >
        Опубликовать
      </span>
      <span
        v-if="selectedRows.length"
        class="--basic"
        @click="$emit('onPreview', selectedRows)"
      >
        Предпросмотр
      </span>
      <span
        v-if="selectedRows.length"
        class="text --basic"
        @click="$emit('onRemoveSelection')"
      >
        Снять выделение
      </span>
      <Actions
        v-if="selectedRows && selectedRows.length === 1"
        :id="selectedRows[0]"
        :selected="selectedRows"
        :is-table-header="true"
        class="actions"
        @duplicate="$emit('onDuplicate', selectedRows[0])"
      />
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
import Actions from '@/pages/bank/test-tasks/list/parts/table/Actions.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import { testTaskPageParams } from '@/pages/bank/test-tasks/list/tasks-page.model'
import Divider from '@/ui/divider/Divider.vue'
import Icon from '@/ui/icon/Icon.vue'
import { modalTasksTypesVisibilityChanged } from '@/pages/common/modals/tasks-bank/tasks-types/tasks-types-modal.model'

export default Vue.extend({
  name: 'TableHeader',
  components: {
    Actions,
    BaseSwitch,
    Divider,
    Icon,
  },
  effector: {
    $treeView: testTaskPageParams.store.treeView,
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
    toggleTreeView: testTaskPageParams.methods.toggleTreeView,
    modalTasksTypesVisibilityChanged,
  },
})
</script>

<style scoped>
.header {
  width: 100%;
  height: 53px;
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
  .actions {
    margin-top: 3px;
  }
  span.--red {
    color: var(--c-red-1);
    margin-right: 25px;
  }
}
</style>
