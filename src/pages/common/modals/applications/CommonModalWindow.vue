<template>
  <Modal
    class="dialog"
    :value="true"
    @change="$emit('close')"
  >
    <HeadModal
      v-if="headText.length"
      :title="headText"
      @close="$emit('close')"
    />
    <Icon
      v-if="isShowIcon"
      :type="icon"
      class="modal-icon"
      size="40"
    />
    <slot />
    <AgreeCancelButtons
      :agree-text="agreeText"
      :cancel-text="cancelText"
      :is-agree-btn="isAgreeBtn"
      :is-cancel-btn="isCancelBtn"
      @agree="$emit('agree')"
      @cancel="$emit('cancel')"
    />
  </Modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import Icon from '@/ui/icon/Icon.vue'
import HeadModal from '@/pages/common/modals/applications/HeadModal.vue'
import AgreeCancelButtons from '@/pages/common/modals/applications/AgreeCancelButtons.vue'

export default Vue.extend({
  name: 'ModalLogout',
  components: {
    Modal,
    Icon,
    HeadModal,
    AgreeCancelButtons,
  },
  props: {
    headText: { type: String as PropType<string>, default: '' },
    isShowIcon: { type: Boolean as PropType<boolean>, default: false },
    icon: { type: String as PropType<string>, default: 'check-green' },
    agreeText: { type: String as PropType<string>, default: 'Продолжить' },
    cancelText: { type: String as PropType<string>, default: 'Отменить' },
    isAgreeBtn: { type: Boolean as PropType<boolean>, default: true },
    isCancelBtn: { type: Boolean as PropType<boolean>, default: true },
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 40px;
  /* styled-text */
  font-size: 18px;
  line-height: 22px;
  text-align: center;
}
.modal-icon {
  margin-bottom: 10px;
}
</style>
