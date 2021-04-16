<template>
  <div class='footer'>
    <BaseButton
      class="btn"
      yellow
      :disabled="$props.disabled"
      @click="$emit('saveAndBackToList')"
    >
      Сохранить и вернуться к списку
    </BaseButton>
    <BaseButton
      class="btn"
      yellow
      :disabled="$props.disabled"
      @click="$emit('save')"
    >
      Сохранить
    </BaseButton>
    <span class="label">Количество тем в тесте: {{ $selectedThemes.length }}</span>
  </div>
</template>

<script>
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import { $selectedThemes } from '@/pages/common/parts/tests/automatic-generation/parts/themes-dropdown/themes-dropdown.model'

export default Vue.extend({
  name: 'TestFooter',
  components: {
    BaseButton,
  },
  effector: {
    $selectedThemes,
  },
  props: {
    title: { type: String, default: '' },
    disabled: { type: Boolean, default: true },
  },
})
</script>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  background-color: #fff;
  border-radius: 3px;
  margin: 20px 0;
}
.title {
  display: flex;
  align-items: center;
  color: var(--base-text-primary);
  font-weight: bold;
  font-size: 20px;
  line-height: 18px;
}
.label {
  margin-left: auto;
  color: #000;
  font-weight: 600;
  line-height: 17px;
}
.back-btn {
  margin-right: 20px;
}
.btn + .btn {
  margin-left: 20px;
}
</style>
