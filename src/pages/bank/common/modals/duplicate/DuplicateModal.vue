<template>
  <Modal
    class="dialog"
    :value="$duplicateModalVisibility"
    @change="changedDuplicateModalVisibility"
  >
    <div class="top">
      <p class="title">Дублирование задания</p>
      <div class="icon-wrapper">
        <Icon
          type="close"
          size="16"
          class="icon"
          @click="changedDuplicateModalVisibility(false)"
        />
      </div>
    </div>
    <div class="input-title">Количество дублей</div>
    <BaseInput
      class="n-input"
      :class="{'n-input_error': !$isDataValid}"
      type="number"
      placeholder="Укажите количество дублей"
      :value="$nDuplicate"
      @input="changedNDuplicate"
    />
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        :disabled="!$isDataValid"
        @click="confirm"
      >
        Продолжить
      </BaseButton>
      <BaseButton
        class="btn"
        big
        border-without-bg
        @click="changedDuplicateModalVisibility(false)"
      >
        Отменить
      </BaseButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $duplicateModalVisibility,
  $nDuplicate,
  changedDuplicateModalVisibility,
  changedNDuplicate,
  $selectedTasks,
  $isDataValid,
  validate,
} from '@/pages/bank/common/modals/duplicate/duplicate.model'
import BaseInput from '@/ui/input/BaseInput.vue'

export default Vue.extend({
  name: 'DuplicateModal',
  components: {
    BaseInput,
    Modal,
    Icon,
    BaseButton,
  },
  effector: {
    $duplicateModalVisibility,
    $nDuplicate,
    $selectedTasks,
    $isDataValid,
  },
  methods: {
    changedDuplicateModalVisibility,
    changedNDuplicate,
    async confirm() {
      await validate(null)
      if ($isDataValid) this.$emit('confirmTaskDuplicate', this.$selectedTasks)
    },
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  width: 540px;
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
.input-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 5px;
}
.n-input {
  width: 100%;
  margin-bottom: 20px;
  padding: 15px;
  height: 46px;
  &_error {
    border: 2px solid var(--c-red-0) !important;
  }
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
