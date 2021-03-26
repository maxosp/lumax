<template>
  <div class="text-match-item">
    <div class="variant-column">
      <FormInput
        :value="value.text"
        class="variant-input"
        placeholder="Введите значение"
        @input="$emit('change', {
          text: $event,
          id: value.id,
        })"
      />
    </div>
    <div class="actions">
      <Icon
        class="remove-icon"
        size="12px"
        type="close"
        @click="$emit('remove', value)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import FormInput from '@/ui/input/FormInput.vue'
import { DraggableText } from '@/pages/common/parts/tasks/types'

export default Vue.extend({
  name: `TextMatchItem`,
  components: {
    FormInput,
    Icon,
  },
  props: {
    value: {
      type: Object as PropType<DraggableText>,
      required: true,
    },
  },
})
</script>

<style scoped>
.text-match-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  width: 100%;
}
.variant-column {
  width: 100%;
  flex-basis: 100%;
  display: flex;
  align-items: center;
}
.variant-column {
  padding-right: 28px;
}
.variant-input {
  width: 100%;
}
.name {
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  color: var(--base-text-primary);
}
.actions {
  justify-content: space-between;
}
.dropdown {
  width: 170px;
  & ::v-deep {
    .inner-input {
      height: 30px;
    }
    .icon-wrap {
      height: 30px;
      right: 13px;
    }
  }
}
.remove-icon {
  cursor: pointer;
  fill: var(--c-grey-3);
}
</style>
