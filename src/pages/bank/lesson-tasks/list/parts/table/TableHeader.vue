<template>
  <div
    class="header"
    :class="{invisible: !total, '--expand': selectedRows.length}"
  >
    <div class="left">
      <span class="text">{{ total | formatTasksTitle }}</span>
      <Divider
        v-if="selectedRows.length"
        vertical
        height="25px"
        class="divider"
      />
      <span
        v-if="showAdditionalActions"
        class="text --basic"
        @click="$emit('onEdit', selectedRows[0])"
      >
        Редактировать
      </span>
      <span
        v-if="selectedRows.length"
        class="text --red"
        @click="handleRemove"
      >
        Удалить
      </span>
      <span
        v-if="showAdditionalActions"
        class="text --basic"
      >
        Дублировать
      </span>
      <span
        v-if="showAdditionalActions"
        class="text --basic"
      >
        Дублировать n раз
      </span>
      <span
        v-if="selectedRows.length"
        class="text --basic"
        @click="$emit('onPreview', selectedRows)"
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
import Divider from '@/ui/divider/Divider.vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import { navigatePush } from '@/features/navigation'
import { lessonTaskPageParams } from '@/pages/bank/lesson-tasks/list/lesson-page.model'
import { modalTasksTypesVisibilityChanged } from '@/pages/common/modals/tasks-bank/tasks-types/tasks-types-modal.model'

export default Vue.extend({
  name: 'TableHeader',
  components: {
    Divider,
    Icon,
    BaseSwitch,
  },
  effector: {
    $treeView: lessonTaskPageParams.store.treeView,
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
    navigatePush,
    toggleTreeView: lessonTaskPageParams.methods.toggleTreeView,
    modalTasksTypesVisibilityChanged,
    handleRemove() {
      this.$emit('onRemove', this.selectedRows)
    },
  },
})
</script>

<style scoped>
.invisible {
  display: none;
}

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
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  .divider {
    background-color: var(--c-grey-15);
    margin: 0 25px;
  }
  .text {
    cursor: pointer;
  }
  .text.--basic {
    margin-right: 25px;
  }
  .text.--basic:last-of-type {
    margin-right: 0;
  }
  .text.--red {
    color: var(--c-red-1);
    margin-right: 25px;
  }
  .left {
    @mixin flex-row-central;
  }
  .right {
    display: flex;
  }
  .right .icon {
    fill: var(--c-grey-3);
    cursor: pointer;
    margin-left: 30px;
  }
}
@media screen and (max-width: 1150px) {
  .header.--expand {
    height: fit-content;
    min-height: 44px;
    overflow-x: auto;
    padding-top: 10px;
    padding-bottom: 10px;
    .right {
      padding-right: 20px;
    }
  }
  .header.--expand .left {
    min-width: 800px;
  }
}
</style>
