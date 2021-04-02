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
    <DifficultyDropdown />
    <Switchers />
    <ModeratorDropdown :disabled="!$canSetModerator" />
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
import DifficultyDropdown from '@/pages/bank/test-tasks/list/parts/modals/tasks-update/parts/difficulty-dropdown/DifficultyDropdown.vue'
import Switchers from '@/pages/bank/test-tasks/list/parts/modals/tasks-update/parts/switchers/Switchers.vue'
import ModeratorDropdown from '@/pages/common/dropdowns/users/moderator-dropdown/ModeratorDropdown.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $modalVisibility,
  modalVisibilityChanged,
  $tasksIds,
  tasksIdsChanged,
  submitForm,
  cancelForm,
  $tasksIdsErrorModule,
  $selectedType,
  $canSetModerator,
} from '@/pages/bank/test-tasks/list/parts/modals/tasks-update/tasks-update-modal.model'
import { loadDifficultys } from '@/pages/bank/test-tasks/list/parts/modals/tasks-update/parts/difficulty-dropdown/difficulty.model'

export default Vue.extend({
  name: 'TasksUpdateModal',
  components: {
    Modal,
    BaseTextarea,
    DifficultyDropdown,
    Switchers,
    ModeratorDropdown,
    BaseButton,
  },
  effector: {
    $modalVisibility,
    $tasksIds,
    idsError: $tasksIdsErrorModule.store.$error,
    $selectedType,
    $canSetModerator,
  },
  methods: {
    modalVisibilityChanged,
    tasksIdsChanged,
    loadDifficultys,
    submitForm,
    cancelForm,
  },
  mounted() {
    loadDifficultys()
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
