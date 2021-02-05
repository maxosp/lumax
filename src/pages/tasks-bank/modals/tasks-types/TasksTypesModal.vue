<template>
  <Modal
    class="dialog"
    :value="$modalTasksTypesVisibility"
    @change="modalTasksTypesVisibilityChanged"
  >
    <div class="top">
      <div class="left">
        <p class="title"> Типы заданий </p>
      </div>
      <div
        class="right"
        @click="modalTasksTypesVisibilityChanged(false)"
      >
        <Icon
          type="close"
          size="15"
          class="icon"
        />
      </div>
    </div>
    <div class="main">
      <div
        v-for="(item, index) in types"
        :key="index"
        class="element"
      >
        <Icon
          :type="item.icon"
          size="20"
          class="icon"
          :class="{'--no-stroke': item.icon === 'type-1'}"
        />
        <p class="text"> {{ item.text }} </p>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import {
  $modalTasksTypesVisibility,
  modalTasksTypesVisibilityChanged,
} from '@/pages/tasks-bank/modals/tasks-types/tasks-types-modal.model'
import Icon from '@/ui/icon/Icon.vue'
import { tasksTypesData } from '@/pages/tasks-bank/modals/tasks-types/data'

export default Vue.extend({
  components: {
    Modal,
    Icon,
  },
  effector: {
    $modalTasksTypesVisibility,
  },
  computed: {
    types() {
      return tasksTypesData
    },
  },
  methods: {
    modalTasksTypesVisibilityChanged,
  },
})
</script>

<style scoped>
.dialog {
  & ::v-deep .modal-body {
    padding: 20px;
  }
  .top {
    @mixin flex-row-central;
    justify-content: space-between;
    margin-bottom: 20px;
    .title {
      font-size: 18px;
      line-height: 22px;
    }
    .right {
      width: 24px;
      height: 24px;
      @mixin flex-center;
      &:hover {
        cursor: pointer;
      }
      .icon {
        fill: var(--c-grey-3);
      }
    }
  }
  .element {
    @mixin flex-row-central;
    .icon {
      fill: transparent;
      stroke: var(--c-dark-0);
      stroke-width: 2px;
      margin-right: 22px;
    }
    .icon.--no-stroke {
      stroke: transparent;
    }
    .text {
      color: var(--base-text-primary);
      line-height: 18px;
    }
  }
  .element:not(:last-child) {
    margin-bottom: 12px;
  }
}
</style>
