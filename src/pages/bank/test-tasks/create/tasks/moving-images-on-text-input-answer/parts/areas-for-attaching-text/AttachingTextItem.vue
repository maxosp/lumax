<template>
  <div class="attaching-images-item">
    <div class="cell">
      <FormInput
        value="B1"
        class="scope-key"
      />
    </div>
    <div class="cell">
      <div class="answer">
        <FormInput
          class="answer-input"
          placeholder="Правильный ответ"
        />
        <div class="add-button-wrapper">
          <BaseButton class="add-button">
            +
          </BaseButton>
        </div>
      </div>
    </div>
    <div class="cell">
      <SizeSettings />
    </div>
    <div class="cell">
      <div class="actions">
        <ColorPicker class="color-picker" />
        <Icon
          class="remove-icon"
          size="12px"
          type="close"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FormInput from '@/ui/input/FormInput.vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import SizeSettings from '../areas-for-attaching-images/SizeSettings.vue'
import ColorPicker from '../areas-for-attaching-images/ColorPicker.vue'

export default Vue.extend({
  name: `AttachingTextItem`,
  components: {
    BaseButton,
    Icon,
    FormInput,
    SizeSettings,
    ColorPicker,
  },
})
</script>

<style scoped>
.attaching-images-item {
  display: table-row;
}
.actions {
  display: flex;
  align-items: center;
}
.cell {
  display: table-cell;
  vertical-align: middle;
  padding-bottom: 10px;
}
.color-picker {
  margin-right: 19px;
}
.scope-key {
  width: 112px;
}
.remove-icon {
  cursor: pointer;
  fill: var(--c-grey-3);
}
.answer {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.add-button-wrapper {
  width: 70px;
}
.answer-input {
  flex: 1;
  margin-right: 10px;
}
.add-button {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: normal;
}
</style>
