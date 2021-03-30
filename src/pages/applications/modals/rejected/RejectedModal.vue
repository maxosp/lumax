<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <Icon
      type="tick-success"
      class="icon"
      size="40"
    />
    <p class="title"> {{ correctTitle }} </p>
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        border-without-bg
        @click="modalVisibilityChanged(false)"
      >
        Ок
      </BaseButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  $modalVisibility,
  modalVisibilityChanged,
} from '@/pages/applications/modals/rejected/rejected.model'

export default Vue.extend({
  name: 'RejectedModal',
  components: {
    Modal,
    BaseButton,
    Icon,
  },
  effector: {
    $modalVisibility,
  },
  computed: {
    correctTitle() {
      return 'Заявка(и) отклонена(ы).'
    },
  },
  methods: { modalVisibilityChanged },
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
.icon {
  display: block;
  margin: 0 auto 10px;
  fill: var(--c-green-0);
}
.btns-wrapper {
  width: 100%;
  @mixin flex-row-central;
  justify-content: center;
  .btn {
    width: 144px;
  }
}
</style>
