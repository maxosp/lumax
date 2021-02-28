<template>
  <Modal
    class="dialog"
    :value="$tasksUpdateModalVisibility"
    @change="tasksUpdateModalVisibilityChanged"
  >
    <p class="title"> Изменение заданий </p>
    <BaseTextarea
      class="textarea"
      :max-length="200"
      placeholder="Перечислите id заданий через запятую"
      :value="$tasksIds"
      label="id заданий"
      @input="tasksIdsChanged"
    />
    <DifficultyDropdown />
    <Switchers />
    <ModeratorDropdown />
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
import DifficultyDropdown from '@/pages/common/modals/tasks-bank/tasks-update/parts/difficulty-dropdown/DifficultyDropdown.vue'
import Switchers from '@/pages/common/modals/tasks-bank/tasks-update/parts/switchers/Switchers.vue'
import ModeratorDropdown from '@/pages/common/modals/tasks-bank/tasks-update/parts/moderator-dropdown/ModeratorDropdown.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $tasksUpdateModalVisibility,
  tasksUpdateModalVisibilityChanged,
  $tasksIds,
  tasksIdsChanged,
  submitForm,
  cancelForm,
} from '@/pages/common/modals/tasks-bank/tasks-update/tasks-update-modal.model'
import { modalLoaded } from '@/pages/common/modals/tasks-bank/tasks-update/parts/difficulty-dropdown/difficulty.model'

export default Vue.extend({
  name: 'ModalLogout',
  components: {
    Modal,
    BaseTextarea,
    DifficultyDropdown,
    Switchers,
    ModeratorDropdown,
    BaseButton,
  },
  effector: {
    $tasksUpdateModalVisibility,
    $tasksIds,
  },
  methods: {
    tasksUpdateModalVisibilityChanged,
    tasksIdsChanged,
    modalLoaded,
    submitForm,
    cancelForm,
  },
  mounted() {
    modalLoaded()
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
  .btn {
    width: 144px;
  }
}
</style>
