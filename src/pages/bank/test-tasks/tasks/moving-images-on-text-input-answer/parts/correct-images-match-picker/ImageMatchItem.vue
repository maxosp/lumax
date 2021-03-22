<template>
  <div class="image-match-item">
    <div class="image-column">
      <div class="image" />
      <div class="name">
        Картинка_2.jpg
      </div>
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

export default Vue.extend({
  name: `ImageMatchItem`,
  components: {
    BaseDropdown,
    SelectItem,
    Icon,
  },
  data: () => ({
    items: ['A1', 'A2', 'нет соответствия '],
  }),
})
</script>

<style scoped>
.image-match-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  width: 100%;
}
.image-column,
.actions {
  width: 50%;
  flex-basis: 50%;
  display: flex;
  align-items: center;
}
.image {
  background: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  height: 30px;
  width: 30px;

  filter: drop-shadow(0px 4px 14px rgba(0, 0, 0, 0.15));
  border-radius: 5px;
  margin-right: 15px;
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
