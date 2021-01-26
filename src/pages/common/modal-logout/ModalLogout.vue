<template>
  <Modal
    class="dialog"
    title="Мои блок-схемы"
    :value="$modalLogoutVisibility"
    @change="modalLogoutVisibilityChanged"
  >
    <p class="title"> Вы действительно хотите выйти из аккаунта? </p>
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        border-without-bg
        @click="fakeLogout"
      >
        Да
      </BaseButton>
      <BaseButton
        class="btn"
        @click="modalLogoutVisibilityChanged(false)"
      >
        Нет
      </BaseButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $modalLogoutVisibility,
  modalLogoutVisibilityChanged,
} from '@/pages/common/modal-logout/modal-logout.model'

export default Vue.extend({
  name: 'ModalLogout',
  components: {
    Modal,
    BaseButton,
  },
  effector: {
    $modalLogoutVisibility,
  },
  methods: {
    modalLogoutVisibilityChanged,
    fakeLogout() {
      modalLogoutVisibilityChanged(false)
      this.$router.push({ name: 'login' })
    },
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
