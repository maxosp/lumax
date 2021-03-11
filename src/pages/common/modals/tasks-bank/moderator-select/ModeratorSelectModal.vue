<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <div class="top">
      <p class="title"> Выбор модератора </p>
      <div class="icon-wrapper">
        <Icon
          type="close"
          size="16"
          class="icon"
          @click="modalVisibilityChanged(false)"
        />
      </div>
    </div>
    <ModeratorDropdown :class="{'--error': moderatorError}" />
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        @click="checkIfTaskCanBeSend"
      >
        Продолжить
      </BaseButton>
      <BaseButton
        class="btn"
        big
        border-without-bg
        @click="modalVisibilityChanged(false)"
      >
        Отменить
      </BaseButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import Icon from '@/ui/icon/Icon.vue'
import ModeratorDropdown from '@/pages/common/modals/tasks-bank/moderator-select/parts/moderator/ModeratorDropdown.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $modalVisibility,
  modalVisibilityChanged,
  checkIfTaskCanBeSend,
  $moderatorErrorModule,
} from '@/pages/common/modals/tasks-bank/moderator-select/moderator-select-modal.model'

export default Vue.extend({
  components: {
    Modal,
    Icon,
    ModeratorDropdown,
    BaseButton,
  },
  effector: {
    $modalVisibility,
    moderatorError: $moderatorErrorModule.store.$error,
  },
  methods: {
    modalVisibilityChanged,
    checkIfTaskCanBeSend,
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  width: 580px;
  padding: 20px 20px 30px 20px;
}
.top {
  @mixin flex-row-central;
  justify-content: space-between;
  margin-bottom: 20px;
  .title {
    font-size: 18px;
    line-height: 22px;
    font-weight: 400;
  }
  .icon {
    fill: var(--c-grey-3);
    &:hover {
      cursor: pointer;
    }
  }
}
.input {
  margin-bottom: 20px;
}
.--error ::v-deep .inner-input {
  border: 2px solid var(--c-red-0) !important;
}
.btns-wrapper {
  @mixin flex-row-central;
  justify-content: center;
  margin-top: 30px;
  button:first-child {
    margin-right: 10px;
  }
}
</style>
