<template>
  <Modal
    class="dialog"
    :value="showModal"
    @change="val => $emit('toggle-modal', val)"
  >
    <p class="title"> {{ correctTitle }} </p>
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        border-without-bg
        @click="$emit('toggle-modal', false)"
      >
        Ок
      </BaseButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import { CheckBeforeDeletionResponseType } from '@/features/api/ticket/types'

export default Vue.extend({
  name: 'CannotDeleteModal',
  components: {
    Modal,
    BaseButton,
  },
  props: {
    showModal: { type: Boolean as PropType<boolean> },
    value: { type: Object as PropType<CheckBeforeDeletionResponseType> },
  },
  computed: {
    correctTitle(): string {
      if (!this.value) return ''
      if (this.value.object_type === 'subject') return this.correctSubjectTitle
      if (this.value.object_type === 'theme') return this.correctThemeTitle
      return ''
    },
    correctSubjectTitle(): string {
      const themes = Array.from(this.value.subject.themes).splice(0, 3)
      return `Предмет не может быть удален, пока к нему привязаны темы ${themes}...`
    },
    correctThemeTitle(): string {
      const { study_resources, test_assignment, parent_theme } = this.value.theme
      return `Тема ${this.value.theme.id} не может быть удалена, пока к ней привязаны ${
        parent_theme ? `другие темы ${parent_theme}` : ''
      } ${study_resources.length > 0 ? `обучающие ресурсы ${study_resources.slice(0, 3)}` : ''} ${
        test_assignment ? `задания ${test_assignment.slice(0, 3)}` : ''
      }`
    },
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  width: 420px;
  padding: 40px;
}
.title {
  width: 100%;
  font-size: 18px;
  line-height: 22px;
  color: #000;
  margin: 0 auto 30px;
  text-align: center;
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
