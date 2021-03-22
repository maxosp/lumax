<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <p class="title">{{ correctForm }}.<br>Продолжить?</p>
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        border-without-bg
        @click="submit"
      > Продолжить
      </BaseButton>
      <BaseButton
        class="btn"
        big
        @click="modalVisibilityChanged(false)"
      > Отменить
      </BaseButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import Modal from '@/ui/modal/Modal.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import Vue from 'vue'
import {
  modalVisibilityChanged,
  $modalVisibility,
  $themeToDelete,
} from '@/pages/dictionary/themes/list/parts/modals/theme-deletion/theme-deletion.model.ts'
import { deleteTheme, deleteThemes } from '@/pages/dictionary/themes/list/themes-page.model.ts'

export default Vue.extend({
  name: 'ThemeDeletion',
  components: {
    Modal,
    BaseButton,
  },
  effector: {
    $modalVisibility,
    $themeToDelete,
  },
  computed: {
    correctForm() {
      return this.$themeToDelete.length === 1 ? 'Тема будет удалена' : 'Темы будут удалены'
    },
  },
  methods: {
    modalVisibilityChanged,
    deleteTheme,
    submit() {
      if (this.$themeToDelete.length === 1) deleteTheme(this.$themeToDelete[0])
      else deleteThemes(this.$themeToDelete)
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
  color: #000000;
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
