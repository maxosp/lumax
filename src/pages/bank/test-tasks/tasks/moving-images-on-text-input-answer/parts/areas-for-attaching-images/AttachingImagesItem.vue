<template>
  <div class="attaching-images-item">
    <div class="cell">
      <FormInput
        value="A1"
        placeholder=""
        label=""
        class="scope-key"
      />
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
import SizeSettings from './SizeSettings.vue'
import ColorPicker from './ColorPicker.vue'

export default Vue.extend({
  name: `AttachingImagesItem`,
  components: {
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
</style>
