<template>
  <div class="select-activator">
    <FormInput
      :placeholder="placeholder"
      :value="value"
      :error-message="errorMessage"
      readonly
      @click="$emit('click')"
    >
      <template #icon>
        <Icon
          class="chevron-icon"
          :class="{open: isOpen}"
          type="chevron-bottom"
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
  name: 'SelectActivator',
  components: {
    FormInput,
    Icon,
  },
  props: {
    isOpen: { type: Boolean as PropType<boolean> },
    value: { type: [String, Number] as PropType<string | number>, required: true },
    placeholder: { type: String as PropType<string>, required: true },
    errorMessage: { type: String as PropType<string>, default: '' },
  },
})
</script>

<style scoped>
* {
  --icon-color: var(--base-text-primary);
}
.select-activator {
  font-weight: 600;
}
.select-activator >>> * {
  cursor: pointer;
}
.chevron-icon {
  fill: var(--icon-color);
  transform-origin: center;
  transition: transform var(--base-animation);
  &.open {
    transform: rotate(180deg);
  }
  & >>> use {
    fill: var(--icon-color) !important;
  }
}
</style>


