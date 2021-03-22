<template>
  <Modal
    class="dialog"
    :value="$deletionRequestModalVisibility"
    @change="deletionRequestModalVisibilityChanged"
  >
    <p class="title"> {{ correctForm }} Продолжить? </p>
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
  $comment,
  $deletionRequestModalVisibility,
  $selectedIds,
  commentChanged,
  deletionRequestModalVisibilityChanged,
} from '@/pages/dictionary/themes/list/parts/modals/deletion-request/deletion-request-modal.model'

export default Vue.extend({
  name: 'DeletionRequest',
  components: {
    Modal,
    BaseTextarea,
    BaseButton,
  },
  effector: {
    $deletionRequestModalVisibility,
    $comment,
    $selectedIds,
  },
  computed: {
    correctForm() {
      return this.$selectedIds.length === 1
        ? 'Будет отправлена заявка на удаление выбранной темы.'
        : 'Будет отправлена заявка на удаление выбранных тем.'
    },
  },
  methods: {
    deletionRequestModalVisibilityChanged,
    commentChanged,
    // TODO add form confirm method
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
  color: #000000;
  margin: 0 auto 20px;
  text-align: center;
}

.textarea {
  margin-bottom: 26px;

  &::v-deep textarea {
    min-height: 150px;
  }
}
.btns-wrapper {
  width: 100%;
  @mixin flex-row-central;
  justify-content: center;

  .btn {
    width: 144px;

    &:first-child {
      margin-right: 10px;
    }
  }
}
</style>
