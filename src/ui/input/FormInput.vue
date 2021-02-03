<template>
  <div class="base-input-wrap">
    <WithError :disabled="!hasError">
      <label>
        <span class="label">
          {{ label }}
        </span>
        <BaseInput
          :value="value"
          :type="type"
          :max-length="maxLength"
          :placeholder="placeholder"
          :disabled="disabled"
          class="inner-input"
          :class="{'--error': hasError}"
          v-on="{
            ...$listeners,
            input: (e) => $emit('input', e),
          }"
        />
        <span
          v-if="$slots.icon"
          class="icon-wrap"
          :class="{'has-error': hasError}"
        >
          <slot name="icon" />
        </span>
      </label>
      <template
        v-if="hasError"
        #error
      >
        <slot
          v-if="$slots.error"
          name="error"
        />
        <ErrorContainer v-else>
          {{ errorMessage }}
        </ErrorContainer>
      </template>
    </WithError>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import WithError from '@/ui/input/parts/WithError.vue'
import BaseInput from '@/ui/input/BaseInput.vue'
import ErrorContainer from '@/ui/input/parts/ErrorContainer.vue'

export default Vue.extend({
  name: 'FormInput',
  components: {
    WithError,
    BaseInput,
    ErrorContainer,
  },
  props: {
    value: { type: [String, Number] as PropType<string | number>, default: '' },
    label: { type: String as PropType<string>, required: true },
    placeholder: { type: String as PropType<string>, required: true },
    type: { type: String as PropType<string>, default: 'text' },
    maxLength: { type: Number },
    errorMessage: { type: String as PropType<string>, default: '' },
    disabled: { type: Boolean as PropType<boolean> },
  },
  model: {
    event: 'input',
    prop: 'value',
  },
  computed: {
    hasError() {
      return this.$slots.error || this.errorMessage
    },
  },
})
</script>

<style scoped>
label {
  width: 100%;
  @mixin flex-column-central;
  align-items: flex-start;
  &.label {
    cursor: default;
  }
}
.inner-input {
  width: 100%;
  height: 46px;
  padding-left: 15px;
  box-sizing: border-box;
  @mixin flex-center;
  align-items: flex-start;
  border-radius: 5px;
  background: var(--c-grey-4);
  border: 0px;
  &::placeholder {
    font-weight: 400;
    line-height: 17px;
    color: var(--c-grey-1);
  }
  &.--error {
    border: 2px solid var(--c-red-0);
  }
}
.label {
  margin-bottom: 5px;
  pointer-events: none;
  font-weight: 600;
  line-height: 17px;
  color: #000;
}
.base-input-wrap ::v-deep .menu-wrap {
  top: 64.5% !important;
}
.icon-wrap {
  position: absolute;
  @mixin flex-center;
  right: 18px;
  bottom: 16px;
}
</style>
