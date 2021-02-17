<template>
  <div class="numeric-input-wrap">
    <BaseInput
      :value="value"
      type="number"
      :max-length="maxLength"
      :disabled="disabled"
      class="inner-input"
      :class="{'--disabled': disabled}"
      v-on="{
        ...$listeners,
        input: (e) => $emit('input', e),
      }"
    />
    <span
      class="icons-wrap"
    >
      <Icon
        type="chevron-up"
        size="10"
        class="icon up"
        @click="increment"
      />
      <Icon
        type="chevron-down"
        size="10"
        class="icon down"
        @click="decrement"
      />
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseInput from '@/ui/input/BaseInput.vue'
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  name: 'NumericInput',
  components: {
    BaseInput,
    Icon,
  },
  props: {
    value: { type: Number as PropType<number>, default: 0 },
    type: { type: String as PropType<string>, default: 'text' },
    maxLength: { type: Number },
    errorMessage: { type: String as PropType<string>, default: '' },
    disabled: { type: Boolean as PropType<boolean> },
  },
  model: {
    event: 'input',
    prop: 'value',
  },
  methods: {
    increment() {
      this.$emit('input', this.$props.value + 1)
    },
    decrement() {
      this.$emit('input', this.$props.value - 1)
    },
  },
})
</script>

<style scoped>
.numeric-input-wrap {
  display: flex;
  background-color: var(--c-grey-5);
  border: 1px solid var(--c-grey-6);
  border-radius: 5px;
  width: max-content;
  padding: 14px 20px 14px 16px;
}

.inner-input {
  border: none;
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
}

.icons-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.icon {
  cursor: pointer;
  stroke: var(--base-text-primary);
}
</style>
