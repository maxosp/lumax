<template>
  <div
    class="checkbox-container"
  >
    <label
      class="checkbox-label"
    >
      <input
        type="checkbox"
        :value="value"
        :checked="value"
        :disabled="disabled"
        class="checkbox-input"
        name="chbx"
        v-on="{
          ...$listeners,
          change: () => $emit('change', !value),
        }"
      >
      <span class="checkmark" />
      <span class="text">
        <slot />
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    disabled: { type: Boolean as PropType<boolean> },
    value: { type: Boolean as PropType<boolean> },
  },
})
</script>

<style scoped>
.checkbox-container {
  .checkbox-label {
    position: relative;

    display: flex;
    align-items: center;
    flex-direction: row;

    .checkmark,
    .text {
      margin-left: 14px;
      display: block;
      font-size: 12px;
      line-height: 17px;
    }
    .checkmark {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid var(--c-grey-8);
      background-color: #ffffff;
      margin: 0;
    }
  }

  .checkbox-input[type='checkbox'] {
    width: 0;
    height: 0;
    display: none;
  }

  .checkbox-label {
    .checkbox-input:checked ~ .checkmark {
      background-color: var(--c-purple-0);
    }
  }

  .checkmark:after {
    content: url('../../assets/icons/icons/tick.svg');
  }

  .checkbox-label .checkbox-input[type='checkbox'] ~ .checkmark::after {
    display: none;
  }
  .checkbox-label .checkbox-input[type='checkbox']:checked ~ .checkmark::after {
    display: block;
  }

  .checkbox-label .checkbox-input:disabled ~ .checkmark {
    border: solid 1.4px #d3d3d3;
    background-color: #d3d3d3;
    &::before {
      content: url('../../assets/icons/icons/tick.svg');
    }
  }
}
</style>


