<template>
  <Modal
    class="dialog"
    :value="$deletionRequestModalVisibility"
    @change="deletionRequestModalVisibilityChanged"
  >
    <p class="title"> Будет отправлена заявка на удаление. <br> Продолжить? </p>
    <BaseTextarea
      class="textarea"
      :max-length="200"
      placeholder="Введите ваш комментарий"
      :value="$comment"
      label="Комментарий"
      @input="commentChanged"
    />
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
        @click="deletionRequestModalVisibilityChanged(false)"
      >
        Отменить
      </BaseButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import BaseTextarea from '@/ui/input/BaseTextarea.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $deletionRequestModalVisibility,
  deletionRequestModalVisibilityChanged,
  $comment,
  commentChanged,
} from '@/pages/common/modals/tasks-bank/deletion-request/deletion-request-modal.model'

export default Vue.extend({
  name: 'ModalLogout',
  components: {
    Modal,
    BaseTextarea,
    BaseButton,
  },
  effector: {
    $deletionRequestModalVisibility,
    $comment,
  },
  methods: {
    deletionRequestModalVisibilityChanged,
    commentChanged,
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  width: 420px;
  padding: 30px 20px;
}
.title {
  font-size: 18px;
  line-height: 22px;
  color: #000;
  margin: 0 auto 20px;
  text-align: center;
}
.textarea {
  margin-bottom: 20px;
  & ::v-deep textarea {
    min-height: 150px;
  }
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
