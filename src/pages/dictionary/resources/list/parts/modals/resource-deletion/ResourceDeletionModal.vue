<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <p class="title"> Обучающий ресурс будет удален.<br> Продолжить?  </p>
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        border-without-bg
        @click="deleteResource($resourceToDelete)"
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
  $resourceToDelete,
} from '@/pages/dictionary/resources/list/parts/modals/resource-deletion/resource-deletion.model'
import { deleteResource } from '@/pages/dictionary/resources/list/resources-page.model'

export default Vue.extend({
  name: 'ResourceDeletion',
  components: {
    Modal,
    BaseButton,
  },
  effector: {
    $modalVisibility,
    $resourceToDelete,
  },
  methods: { modalVisibilityChanged, deleteResource },
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
