<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <div class="top">
      <p class="title">Создание папки</p>
      <div class="icon-wrapper">
        <Icon
          type="close"
          size="16"
          class="icon"
          @click="modalVisibilityChanged(false)"
        />
      </div>
    </div>
    <PositionDropdown />
    <FormInput
      class="form-input"
      :class="{'--error': titleError}"
      placeholder="Введите имя папки"
      :value="$folderTitle"
      label="Имя папки"
      @input="folderTitleChanged"
    />
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        border-without-bg
        @click="modalVisibilityChanged(false)"
      >
        Отменить
      </BaseButton>
      <BaseButton
        class="btn"
        big
        @click="checkIfFolderCanBeSend"
      >
        Сохранить
      </BaseButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import Icon from '@/ui/icon/Icon.vue'
import FormInput from '@/ui/input/FormInput.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $modalVisibility,
  modalVisibilityChanged,
  $titleErrorModule,
  $folderTitle,
  folderTitleChanged,
  checkIfFolderCanBeSend,
} from '@/pages/common/modals/tasks-bank/creating-folder/creating-folder-modal.model'
import PositionDropdown from '@/pages/common/dropdowns/bank/lesson-tasks/position-dropdown/PositionDropdown.vue'

export default Vue.extend({
  name: 'CreatingFolderModal',
  components: {
    Modal,
    Icon,
    FormInput,
    BaseButton,
    PositionDropdown,
  },
  effector: {
    $modalVisibility,
    titleError: $titleErrorModule.store.$error,
    $folderTitle,
  },
  methods: {
    modalVisibilityChanged,
    checkIfFolderCanBeSend,
    folderTitleChanged,
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  width: 580px;
  padding: 20px 20px 30px 20px;
}
.top {
  @mixin flex-row-central;
  justify-content: space-between;
  margin-bottom: 20px;
  .title {
    font-size: 18px;
    line-height: 22px;
    font-weight: 400;
  }
  .icon {
    fill: var(--c-grey-3);
    &:hover {
      cursor: pointer;
    }
  }
}
.input {
  margin-bottom: 20px;
}
.--error ::v-deep .inner-input {
  border: 2px solid var(--c-red-0) !important;
}
.btns-wrapper {
  @mixin flex-row-central;
  justify-content: center;
  margin-top: 30px;
  button:first-child {
    margin-right: 10px;
  }
}
</style>
