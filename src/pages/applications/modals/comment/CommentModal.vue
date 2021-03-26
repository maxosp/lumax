<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <div class="top">
      <p class="title"> Просмотр комментария </p>
      <div class="icon-wrapper">
        <Icon
          type="close"
          size="16"
          class="icon"
          @click="modalVisibilityChanged(false)"
        />
      </div>
    </div>
    <div class="text">
      {{ $comment }}
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  $modalVisibility,
  $selectedId,
  modalVisibilityChanged,
  $comment,
} from '@/pages/applications/modals/comment/comment.model'

export default Vue.extend({
  name: 'CommentModal',
  components: {
    Modal,
    Icon,
  },
  effector: {
    $modalVisibility,
    $selectedId,
    $comment,
  },
  methods: {
    modalVisibilityChanged,
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  width: 420px;
  padding: 20px;
}
.top {
  @mixin flex-row-central;
  justify-content: space-between;
  margin-bottom: 30px;
  .title {
    font-size: 18px;
    line-height: 22px;
  }
  .icon {
    fill: var(--c-grey-3);
    &:hover {
      cursor: pointer;
    }
  }
}
.text {
  line-height: 24px;
  margin-top: 20px;
}
</style>
