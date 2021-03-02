<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <p class="title"> Метка будет удалена.<br> Продолжить?  </p>
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        border-without-bg
        @click="deleteLabel($labelToDelete)"
      >
        Продолжить
      </BaseButton>
      <BaseButton
        class="btn"
        big
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
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $modalVisibility,
  modalVisibilityChanged,
  $labelToDelete,
} from '@/pages/labels/parts/modals/label-deletion/label-deletion.model'
import { deleteLabel } from '@/pages/labels/labels-page.model'

export default Vue.extend({
  name: 'LabelDeletion',
  components: {
    Modal,
    BaseButton,
  },
  effector: {
    $modalVisibility,
    $labelToDelete,
  },
  methods: {
    modalVisibilityChanged,
    deleteLabel,
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
    cursor: pointer;
    width: 144px;
  }
}
</style>
