<template>
  <Modal
    class="dialog"
    :value="$requestDeleteModalVisibility"
    @change="requestDeleteModalVisibilityChanged"
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
        @click="$emit('confirmRequestDelete', $comment, $selectedIds)"
      >
        Продолжить
      </BaseButton>
      <BaseButton
        class="btn"
        big
        @click="requestDeleteModalVisibilityChanged(false)"
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
  $requestDeleteModalVisibility,
  requestDeleteModalVisibilityChanged,
  $comment,
  commentChanged,
  $selectedIds,
} from '@/pages/common/modals/request-delete/request-delete-modal.model'

export default Vue.extend({
  name: 'DeleteRequestModal',
  components: {
    Modal,
    BaseTextarea,
    BaseButton,
  },
  effector: {
    $selectedIds,
    $requestDeleteModalVisibility,
    $comment,
  },
  methods: {
    requestDeleteModalVisibilityChanged,
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
