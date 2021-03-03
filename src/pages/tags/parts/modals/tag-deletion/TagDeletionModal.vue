<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <p class="title"> {{ correctForm }}.<br> Продолжить?  </p>
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        border-without-bg
        @click="submit"
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
  $tagsToDelete,
} from '@/pages/tags/parts/modals/tag-deletion/tag-deletion.model'
import { deleteTag, deleteTags } from '@/pages/tags/tags-page.model'

export default Vue.extend({
  name: 'TagDeletion',
  components: {
    Modal,
    BaseButton,
  },
  effector: {
    $modalVisibility,
    $tagsToDelete,
  },
  computed: {
    correctForm() {
      return this.$tagsToDelete.length === 1 ? 'Тег будет удален' : 'Теги будут удалены'
    },
  },
  methods: {
    modalVisibilityChanged,
    deleteTag,
    submit() {
      if (this.$tagsToDelete.length === 1) deleteTag(this.$tagsToDelete[0])
      else deleteTags({ olympiad_tags: this.$tagsToDelete })
    },
  },
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
