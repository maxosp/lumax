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
        :name="name"
        v-on="{
          ...$listeners,
          change: () => $emit('change', !value),
        }"
      >
      <span class="checkmark">
        <Icon
          type="tick"
          size="18"
          class="icon"
        />
      </span>
      <span class="text">
        <slot />
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  components: {
    Icon,
  },
  props: {
    disabled: { type: Boolean as PropType<boolean> },
    value: { type: Boolean as PropType<boolean> },
    name: { type: String as PropType<string>, default: 'ckbx' },
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
      cursor: pointer;
      color: var(--base-text-primary);
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
      background-color: var(--base-text-primary);
    }
  }

  .checkbox-label .checkbox-input:disabled ~ .checkmark {
    border: solid 1.4px #d3d3d3;
    background-color: #d3d3d3;
  }
}
.icon {
  stroke: #fff;
  fill: transparent;
}
</style>


