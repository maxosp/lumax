<template>
  <Modal
    class="dialog"
    :value="$confirmDeleteModalVisibility"
    @change="confirmDeleteModalVisibilityChanged"
  >
    <p class="title"> {{ correctTitle }} <br> Продолжить? </p>
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        border-without-bg
        @click="$emit('confirmDelete', $selectedIds, type)"
      >
        Продолжить
      </BaseButton>
      <BaseButton
        class="btn"
        big
        @click="confirmDeleteModalVisibilityChanged(false)"
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
import { mapDeleteModalTypeToTitle } from '@/pages/common/modals/confirm-delete/constants'
import {
  $confirmDeleteModalVisibility,
  $selectedIds,
  confirmDeleteModalVisibilityChanged,
} from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'

export default Vue.extend({
  name: 'ConfirmDeleteModal',
  components: {
    Modal,
    BaseButton,
  },
  effector: {
    $confirmDeleteModalVisibility,
    $selectedIds,
  },
  props: {
    type: { type: String, required: true },
  },
  computed: {
    correctTitle(): string {
      if (this.$selectedIds.length === 1) {
        return `${mapDeleteModalTypeToTitle[this.type].typeWord.singular} ${this.$selectedIds.join(
          ', '
        )} будет ${mapDeleteModalTypeToTitle[this.type].deleteWord.singular}.`
      }
      return `${mapDeleteModalTypeToTitle[this.type].typeWord.plural} будут ${
        mapDeleteModalTypeToTitle[this.type].deleteWord.plural
      }.`
    },
  },
  methods: {
    confirmDeleteModalVisibilityChanged,
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
