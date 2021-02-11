<template>
  <div class="filter">
    <BaseInput
      :value="$searchString"
      placeholder="Поиск"
      class="input"
      @input="handleSearchString"
    />
    <div class="right-section">
      <BaseDropdown
        class="dropdown"
        :placeholder="$searchField.title"
        :value="$searchField.title"
        label=""
      >
        <template #default="{closeMenu}">
          <SelectItem
            v-for="item in $props.searchFields"
            :key="item.name"
            :placeholder="item.title"
            @click="handleSearchFieldClick(item, closeMenu)"
          >
            {{ item.title }}
          </SelectItem>
        </template>
      </BaseDropdown>
      <Icon
        id="filter-icon"
        class="filter-settings"
        type="filter-settings"
        @click="$emit('handleFilterVisibility')"
      />
    </div>
    <slot name="filter" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseInput from '@/ui/input/BaseInput.vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  $searchString,
  searchStringChanged,
  $searchField,
  searchFieldChanged,
  reset,
} from '@/pages/common/general-filter/general-filter.model.ts'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  name: 'GeneralFilter',
  components: {
    BaseInput,
    BaseDropdown,
    SelectItem,
    Icon,
  },
  effector: {
    $searchString,
    $searchField,
  },
  props: {
    searchFields: { type: Array as PropType<DropdownItem[]>, required: true },
  },
  methods: {
    searchStringChanged,
    searchFieldChanged,
    handleSearchString(value: string) {
      searchStringChanged(value)
      this.$emit('setFilter', {
        [`search_${this.$searchField.name}`]: 'true',
        search: value,
      })
    },
    handleSearchFieldClick(item: DropdownItem, cb: any) {
      searchFieldChanged(item)
      this.$emit('setFilter', {
        [`search_${item.name}`]: 'true',
        search: this.$searchString,
      })
      cb()
    },
  },
  mounted() {
    reset()
  },
})
</script>

<style scoped>
.filter {
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  border-radius: 7px;
  margin-bottom: 10px;
}

.input {
  border: none;
  width: 400px;
  height: 100%;
}

.right-section {
  display: flex;
  align-items: center;
}
.dropdown {
  margin-right: 20px;
  & /deep/ .label {
    display: none;
  }
  & /deep/ .inner-input {
    background-color: var(--c-grey-3);
    color: #fff;
    font-weight: 600;
    height: 30px;
  }
  & /deep/ .icon-wrap {
    bottom: 0;
    height: 100%;
  }
  & /deep/ .chevron-icon {
    stroke: #fff;
  }
  & /deep/ .icon.cross {
    fill: #fff;
  }
}

.filter-settings {
  cursor: pointer;
}
</style>
