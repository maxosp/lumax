<template>
  <div class="btns-wrapper">
    <BaseButton
      v-if="isAgreeBtn"
      class="btn"
      big
      border-without-bg
      @click="$emit('agree')"
    >
      {{ agreeText }}
    </BaseButton>
    <BaseButton
      v-if="isCancelBtn"
      class="btn"
      big
      @click="$emit('cancel')"
    >
      {{ cancelText }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'

export default Vue.extend({
  name: 'AgreeCancelButtons',
  components: { BaseButton },
  props: {
    agreeText: { type: String as PropType<string>, default: 'Продолжить' },
    cancelText: { type: String as PropType<string>, default: 'Отменить' },
    isAgreeBtn: { type: Boolean as PropType<boolean>, default: true },
    isCancelBtn: { type: Boolean as PropType<boolean>, default: true },
  },
})
</script>

<style scoped>
.btns-wrapper {
  width: 100%;
  @mixin flex-row-central;
  justify-content: center;
  margin-top: 20px;
  .btn {
    width: 144px;
    &:nth-child(2) {
      margin-left: 10px;
    }
  }
}
</style>
