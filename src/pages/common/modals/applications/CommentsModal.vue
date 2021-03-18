<template>
  <Modal
    class="dialog"
    :value="true"
    @change="$emit('close')"
  >
    <Icon
      type="close"
      class="modal-icon"
      size="12"
      @click="$emit('close')"
    />
    <p class="title-modal">Оставить комментарий</p>
    <div class="text-area-wrapper">
      <p class="title-textarea">Комментарий</p>
      <BaseTextarea
        placeholder="Введите ваш комментарий"
        :value="text"
      />
    </div>
    <div class="uploader-block">
      <!-- TODO uploader element -->
      <div class="wrapper-images">
        <!-- TODO v-for items -->
        <FileElement />
      </div>
    </div>
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        border-without-bg
        @change="$emit('close')"
      >
        Отменить
      </BaseButton>
      <BaseButton
        class="btn"
        big
        @change="$emit('agree')"
      >
        Отправить на доработку
      </BaseButton>
    </div>
  </Modal>
</template>


<script lang="ts">
import Vue from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseTextarea from '@/ui/input/BaseTextarea.vue'
import FileElement from '@/pages/common/modals/applications/parts/FileElement.vue'

export default Vue.extend({
  name: 'ModalLogout',
  components: {
    Modal,
    Icon,
    BaseButton,
    BaseTextarea,
    FileElement,
  },
  data() {
    return {
      text: '',
    }
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 30px 20px;
  position: relative;
}
.modal-icon {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
  fill: var(--c-grey-3);
}
.title-modal {
  text-align: center;
  font-size: 18px;
  line-height: 22px;
}
.text-area-wrapper {
  margin-top: 30px;
  width: 100%;
}
.title-textarea {
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 5px;
}
.uploader-block {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
}
.btns-wrapper {
  width: 100%;
  @mixin flex-row-central;
  justify-content: center;
  margin-top: 20px;
  .btn {
    &:nth-child(2) {
      margin-left: 10px;
    }
  }
}
.wrapper-images {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
