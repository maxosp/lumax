<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <div class="top">
      <p class="title"> Редактирование метки </p>
      <div class="icon-wrapper">
        <Icon
          type="close"
          size="16"
          class="icon"
          @click="modalVisibilityChanged(false)"
        />
      </div>
    </div>
    <SubjectDropdown :class="{'--error': subjectError}" />
    <ClassDropdown :class="{'--error': classError}" />
    <ThemeDropdown
      :class="{'--error': themeError}"
      is-disabled
    />
    <BaseTextarea
      class="textarea"
      :class="{'--error': titleError}"
      :max-length="200"
      placeholder="Введите название метки"
      :value="$labelTitle"
      label="Название метки"
      @input="labelTitleChanged"
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
        @click="checkIfThemeCanBeSend"
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
import SubjectDropdown from '@/pages/common/dropdowns/subject/SubjectsDropdown.vue'
import ClassDropdown from '@/pages/common/dropdowns/class/ClassesDropdown.vue'
import ThemeDropdown from '@/pages/common/dropdowns/themes-tree/ThemeDropdown.vue'
import BaseTextarea from '@/ui/input/BaseTextarea.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $modalVisibility,
  modalVisibilityChanged,
  $subjectErrorModule,
  $classErrorModule,
  $titleErrorModule,
  $themeErrorModule,
  checkIfThemeCanBeSend,
  $labelTitle,
  labelTitleChanged,
} from '@/pages/labels/parts/modals/label-edition/label-edition.modal'

export default Vue.extend({
  components: {
    Modal,
    Icon,
    SubjectDropdown,
    ClassDropdown,
    ThemeDropdown,
    BaseTextarea,
    BaseButton,
  },
  effector: {
    $modalVisibility,
    subjectError: $subjectErrorModule.store.$error,
    classError: $classErrorModule.store.$error,
    titleError: $titleErrorModule.store.$error,
    themeError: $themeErrorModule.store.$error,
    $labelTitle,
  },
  methods: {
    modalVisibilityChanged,
    checkIfThemeCanBeSend,
    labelTitleChanged,
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
.--error ::v-deep .inner-input,
.--error ::v-deep .base-textarea {
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
