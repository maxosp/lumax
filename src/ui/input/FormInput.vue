<template>
  <div class="base-input-wrap">
    <WithError :disabled="!hasError">
      <label
        :class="{
          active: isPlaceholderOnTop,
          'classic-placeholder': classicPlaceholder,
          'has-error': hasError,
          disabled,
        }"
      >
        <BaseInput
          :value="value"
          :readonly="readonly"
          :type="type"
          :autofocus="autofocus"
          :max-length="maxLength"
          class="inner-input"
          :class="{'classic-placeholder': classicPlaceholder}"
          v-on="{
            ...$listeners,
            focus: onFocus,
            blur: onBlur,
            input: (e) => $emit('input', e),
          }"
        />
        <span
          class="placeholder"
          :class="{
            'on-top': isPlaceholderOnTop,
            'classic-placeholder': classicPlaceholder,
          }"
        >
          {{ placeholder }}
        </span>

        <span
          v-if="$slots.icon"
          class="icon-wrap"
          :class="{'has-error': hasError}"
        >
          <slot name="icon" />
        </span>
        <span
          v-else-if="hasError"
          class="icon-wrap"
          :class="{'has-error': hasError}"
        >
          <Icon
            type="lightning"
            size="19"
          />
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
import BaseInput from '@/ui/input/BaseInput.vue'
import Icon from '@/ui/icon/Icon.vue'
import WithError from '@/ui/input/parts/WithError.vue'
import ErrorContainer from '@/ui/input/parts/ErrorContainer.vue'

export default Vue.extend({
  name: 'FormInput',
  components: {
    BaseInput,
    Icon,
    WithError,
    ErrorContainer,
  },
  props: {
    value: { type: [String, Number] as PropType<string | number>, default: '' },
    placeholder: { type: String as PropType<string>, required: true },
    errorMessage: { type: String as PropType<string>, default: '' },
    type: { type: String as PropType<string>, default: 'text' },
    disabled: { type: Boolean as PropType<boolean> },
    readonly: { type: Boolean as PropType<boolean> },
    autofocus: { type: Boolean as PropType<boolean> },
    maxLength: { type: Number },
    // если true, прейсхолдер ведет себя как стандартный плейсхолдер в инпутах (не улетает вверх, а исчезает)
    classicPlaceholder: { type: Boolean as PropType<boolean> },
  },
  model: {
    event: 'input',
    prop: 'value',
  },
  data: () => ({
    isFocused: false,
  }),

  computed: {
    isPlaceholderOnTop() {
      return this.value || this.isFocused
    },

    hasError() {
      return this.$slots.error || this.errorMessage
    },
    getSlots() {
      return this.$slots.customInput
    },
  },

  methods: {
    onFocus(e: FocusEvent) {
      if (!this.readonly) {
        this.isFocused = true
      }
      this.$emit('focus', e)
    },
    onBlur(e: FocusEvent) {
      if (!this.readonly) {
        this.isFocused = false
      }
      this.$emit('blur', e)
    },
  },
})
</script>

<style scoped>
* {
  --bg-color: var(--c-grey-5);
  --border-color: var(--c-grey-5);
  --placeholder-color: var(--base-placeholder-color);

  --bg-active-color: white;
  --border-active-color: var(--c-grey-8);

  --error-color: var(--c-error);

  --side-padding: 15px;
}
label {
  display: flex;
  position: relative;
  width: 100%;
  height: 60px;
  align-items: center;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  border-radius: 8px;
  cursor: text;
  transition: border-color var(--base-animation), background-color var(--base-animation);
  &.active {
    border-color: var(--border-active-color);
    background-color: var(--bg-active-color);
  }
  &.has-error {
    border: 2px solid var(--error-color) !important;
  }
  &.placeholder {
    cursor: default;
  }
}
.inner-input {
  padding: 15px var(--side-padding) 0;
  &.classic-placeholder {
    padding-top: 0;
    font-size: 14px;
    opacity: 0.5;
    color: #000;
  }
}
.placeholder {
  position: absolute;
  top: 50%;
  left: var(--side-padding);
  font-size: 14px;
  font-weight: 300;
  color: var(--placeholder-color);
  transform: translateY(-50%);
  pointer-events: none;
  transition: top var(--base-animation), transform var(--base-animation),
    font-size var(--base-animation);

  &.on-top:not(.classic-placeholder) {
    top: 8px;
    font-size: 12px;
    transform: none;
  }
  &.on-top.classic-placeholder {
    display: none;
  }
}

.icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  margin-right: 15px;
  &.has-error {
    & >>> use {
      fill: var(--error-color) !important;
    }
  }
}
</style>


