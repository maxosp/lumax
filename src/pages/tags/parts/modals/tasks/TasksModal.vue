<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <div class="top">
      <p class="title"> Тег: {{ $tagTitle }}  </p>
      <div class="icon-wrapper">
        <Icon
          type="close"
          size="16"
          class="icon"
          @click="modalVisibilityChanged(false)"
        />
      </div>
    </div>
    <div class="main">
      <p class="title">
        {{ $tagsList.length ? 'Список ID заданий' : 'Задания не привязаны к тегу' }}
      </p>
      <div class="list">
        <span
          v-for="(item, index) in $tagsList"
          :key="index"
        >
          {{ item }}{{ index !== $tagsList.length - 1 ? ',' : '' }}
        </span>
      </div>
    </div>
    <div v-if="$tagsList.length" class="btn-wrapper">
      <BaseButton
        class="btn"
        big
        @click="handleOnPreview"
      >
        Перейти к массовому предпросмотру
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
  $modalVisibility,
  modalVisibilityChanged,
  $tagTitle,
  $tagsList,
} from '@/pages/tags/parts/modals/tasks/tasks.model'

export default Vue.extend({
  name: 'ModalLogout',
  components: {
    Modal,
    Icon,
    BaseButton,
  },
  effector: {
    $modalVisibility,
    $tagTitle,
    $tagsList,
  },
  methods: {
    modalVisibilityChanged,
    handleOnPreview() {
      this.$emit('showPreview', this.$tagsList)
      modalVisibilityChanged(false)
    },
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
.main {
  .title,
  .list {
    font-size: 14px;
    line-height: 18px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .list {
    margin-bottom: 30px;
  }
}
.btn-wrapper {
  width: 100%;
  @mixin flex-row-central;
  justify-content: center;
  .btn {
    cursor: pointer;
  }
}
</style>
