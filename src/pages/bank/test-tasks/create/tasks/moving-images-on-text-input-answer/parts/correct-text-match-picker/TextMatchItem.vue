<template>
  <div class="text-match-item">
    <div class="variant-column">
      <FormInput
        v-model="value"
        class="variant-input"
        placeholder="Введите значение"
      />
    </div>
    <div class="actions">
      <BaseDropdown
        class="dropdown"
        placeholder="Выберите язык"
        :value="'A1'"
        read-only-dropdown
      >
        <template>
          <SelectItem
            v-for="item in items"
            :key="item"
            :placeholder="item"
            class="select-item"
          >
            {{ item }}
          </SelectItem>
        </template>
      </BaseDropdown>
      <Icon
        class="remove-icon"
        size="12px"
        type="close"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import Icon from '@/ui/icon/Icon.vue'
import FormInput from '@/ui/input/FormInput.vue'

export default Vue.extend({
  name: `TextMatchItem`,
  components: {
    FormInput,
    BaseDropdown,
    SelectItem,
    Icon,
  },
  data: () => ({
    value: 'value',
    items: ['A1', 'A2', 'нет соответствия '],
  }),
})
</script>

<style scoped>
.text-match-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  width: 100%;
}
.variant-column,
.actions {
  width: 50%;
  flex-basis: 50%;
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
