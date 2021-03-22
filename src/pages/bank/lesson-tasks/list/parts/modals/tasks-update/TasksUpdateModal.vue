<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <p class="title"> Изменение заданий </p>
    <BaseTextarea
      class="textarea"
      :max-length="200"
      placeholder="Перечислите id заданий через запятую"
      :value="$tasksIds"
      label="id заданий"
      :class="{'--error': idsError}"
      @input="tasksIdsChanged"
    />
    <Switchers />
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        @click="submitForm"
      >
        Продолжить
      </BaseButton>
      <BaseButton
        class="btn"
        big
        border-without-bg
        @click="cancelForm"
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
import Switchers from '@/pages/bank/lesson-tasks/list/parts/modals/tasks-update/parts/switchers/Switchers.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $modalVisibility,
  modalVisibilityChanged,
  $tasksIds,
  tasksIdsChanged,
  submitForm,
  cancelForm,
  $tasksIdsErrorModule,
} from '@/pages/bank/lesson-tasks/list/parts/modals/tasks-update/tasks-update-modal.model'

export default Vue.extend({
  name: 'TasksUpdateModal',
  components: {
    Modal,
    BaseTextarea,
    Switchers,
    BaseButton,
  },
  effector: {
    $modalVisibility,
    $tasksIds,
    idsError: $tasksIdsErrorModule.store.$error,
  },
  methods: {
    modalVisibilityChanged,
    tasksIdsChanged,
    submitForm,
    cancelForm,
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
}
.btns-wrapper {
  width: 100%;
  @mixin flex-row-central;
  justify-content: space-between;
  margin-top: 20px;
  .btn {
    width: 144px;
  }
}
.--error ::v-deep .base-textarea {
  border: 2px solid var(--c-red-0) !important;
}
</style>
