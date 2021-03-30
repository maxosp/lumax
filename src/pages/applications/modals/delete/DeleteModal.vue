<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <p class="title"> {{ correctTitle }} <br> Продолжить? </p>
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        border-without-bg
        @click="handleClick"
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
  $selectedIds,
  modalVisibilityChanged,
} from '@/pages/applications/modals/delete/delete.model'

export default Vue.extend({
  name: 'RejectModal',
  components: {
    Modal,
    BaseButton,
  },
  effector: {
    $modalVisibility,
    $selectedIds,
  },
  computed: {
    correctTitle() {
      return this.$selectedIds.length === 1
        ? `Элемент ${this.$selectedIds[0]} будет удален.`
        : `Элементы ${this.$selectedIds.join(', ')} будут удалены.`
    },
  },
  methods: {
    modalVisibilityChanged,
    handleClick() {
      this.$emit('delete', this.$selectedIds)
      modalVisibilityChanged(false)
    },
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  width: 420px;
}
.title {
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
