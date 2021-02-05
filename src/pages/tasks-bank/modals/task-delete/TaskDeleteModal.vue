<template>
  <Modal
    class="dialog"
    :value="$modalTaskDeleteVisibility"
    @change="modalTaskDeleteVisibilityChanged"
  >
    <p class="title"> Задание будет удалено. <br> Продолжить? </p>
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        border-without-bg
      >
        Продолжить
      </BaseButton>
      <BaseButton
        class="btn"
        big
        @click="modalTaskDeleteVisibilityChanged(false)"
      >
        Отменить
      </BaseButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $modalTaskDeleteVisibility,
  modalTaskDeleteVisibilityChanged,
} from '@/pages/tasks-bank/modals/task-delete/task-delete-modal.model'

export default Vue.extend({
  name: 'ModalLogout',
  components: {
    Modal,
    BaseButton,
  },
  effector: {
    $modalTaskDeleteVisibility,
  },
  methods: {
    modalTaskDeleteVisibilityChanged,
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  width: 420px;
}
.title {
  max-width: 220px;
  font-size: 18px;
  line-height: 22px;
  color: #000;
  margin: 0 auto 30px;
  text-align: center;
}
.btns-wrapper {
  width: 100%;
  @mixin flex-row-central;
  justify-content: space-between;
  .btn {
    width: 144px;
  }
}
</style>
