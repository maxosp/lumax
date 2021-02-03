<template>
  <div class="select-activator">
    <FormInput
      :value="value"
      :error-message="errorMessage"
      :placeholder="placeholder"
      :label="label"
      :disabled="disabled"
      class="input"
      @click="$emit('click')"
      @input="(e) => $emit('input', e)"
    >
      <template #icon>
        <Icon
          class="chevron-icon"
          :class="{open: isOpen}"
          type="chevron-down"
          size="16"
        />
      </template>

      <template #error>
        <slot name="error" />
      </template>
    </FormInput>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import FormInput from '@/ui/input/FormInput.vue'
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  name: 'DropdownActivator',
  components: {
    FormInput,
    Icon,
  },
  props: {
    isOpen: { type: Boolean as PropType<boolean> },
    disabled: { type: Boolean as PropType<boolean> },
    value: { type: [String, Number] as PropType<string | number>, required: true },
    errorMessage: { type: String as PropType<string>, default: '' },
    placeholder: { type: String as PropType<string>, required: true },
    label: { type: String as PropType<string>, required: true },
  },
})
</script>

<style scoped>
* {
  --icon-color: var(--base-text-primary);
}

.select-activator >>> * {
  cursor: pointer;
}
.select-activator {
  & ::v-deep .inner-input {
    background-color: var(--c-grey-5);
    border: 1px solid var(--c-grey-6);
  }
}
.chevron-icon {
  fill: var(--icon-color);
  transform-origin: center;
  transition: transform var(--base-animation);
  width: 19px;
  height: 12px;
  &.open {
    transform: rotate(180deg);
  }
}
</style>


