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
          :readonly="readOnlyDropdown"
          class="inner-input"
          :class="{'--error': hasError, '--disabled': disabled}"
          v-on="{
            ...$listeners,
            input: (e) => $emit('input', e),
          }"
        />
        <span
          v-if="$slots.icon || showClearBtn"
          class="icon-wrap"
          :class="{'has-error': hasError, '--disabled': disabled}"
        >
          <Icon
            v-if="showClearBtn"
            type="close"
            size="10"
            class="icon cross"
            @click="$emit('clear')"
          />
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
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  name: 'FormInput',
  components: {
    WithError,
    BaseInput,
    ErrorContainer,
    Icon,
  },
  props: {
    value: { type: [String, Number] as PropType<string | number>, default: '' },
    label: { type: String as PropType<string>, required: true },
    placeholder: { type: String as PropType<string>, required: true },
    type: { type: String as PropType<string>, default: 'text' },
    maxLength: { type: Number },
    errorMessage: { type: String as PropType<string>, default: '' },
    disabled: { type: Boolean as PropType<boolean> },
    clearBtn: { type: Boolean as PropType<boolean> },
    readOnlyDropdown: { type: Boolean as PropType<boolean> },
  },
  model: {
    event: 'input',
    prop: 'value',
  },
  data: () => ({
    showClearBtn: false,
  }),
  computed: {
    hasError() {
      return this.$slots.error || this.errorMessage
    },
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.showClearBtn = newVal !== oldVal && newVal.length && this.clearBtn
      },
    },
  },
  mounted() {
    if (this.value && this.clearBtn) {
      this.showClearBtn = true
    }
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
  padding: 0 38px 0 15px;
  box-sizing: border-box;
  @mixin flex-center;
  align-items: flex-start;
  border-radius: 5px;
  background: var(--c-grey-4);
  border: 0px;
  &::placeholder {
    font-weight: 400;
    line-height: 46px;
    color: var(--c-grey-1);
  }
  &.--error {
    border: 2px solid var(--c-red-0);
  }
  &.--disabled {
    border: 1px solid var(--c-grey-3) !important;
    background-color: var(--base-bg-color) !important;
    &::placeholder {
      color: var(--base-text-secondary);
    }
    &:hover {
      cursor: default;
    }
  }
}
.label {
  margin-bottom: 5px;
  pointer-events: none;
  font-weight: 600;
  color: #000;
}
.base-input-wrap ::v-deep .menu-wrap {
  top: 64.5% !important;
}
.icon-wrap {
  position: absolute;
  @mixin flex-center;
  width: fit-content;
  height: 45px;
  right: 18px;
  bottom: 0;
  &.--disabled ::v-deep .chevron-icon {
    stroke: var(--c-grey-10);
  }
  .icon.cross {
    fill: var(--base-text-primary);
    &:hover {
      cursor: pointer;
    }
  }
  .icon:not(:last-child) {
    margin-right: 5px;
  }
}
</style>
