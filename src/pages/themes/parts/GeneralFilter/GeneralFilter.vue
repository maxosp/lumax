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
            v-for="item in searchFields"
            :key="item.name"
            :placeholder="item.title"
            @click="handleSearchFieldClick(item, closeMenu)"
          >
            {{ item.title }}
          </SelectItem>
        </template>
      </BaseDropdown>
      <Icon class="filter-settings" type="filter-settings" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseInput from '@/ui/input/BaseInput.vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  $searchString,
  searchStringChanged,
  $searchField,
  searchFieldChanged,
} from '@/pages/themes/parts/GeneralFilter/general-filter.model.ts'
import { searchFieldsData } from '@/pages/themes/constants'
import { SearchField } from '@/pages/themes/types'

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
  data() {
    return {
      searchFields: searchFieldsData,
    }
  },
  methods: {
    searchStringChanged,
    searchFieldChanged,
    handleSearchString(value: string) {
      searchStringChanged(value)
      this.$emit('setFilter', { filter: 'search', value })
    },
    handleSearchFieldClick(item: SearchField, cb: any) {
      searchFieldChanged(item)
      // this.$emit('setFilter', { filter: item.name, value: item.title })
      cb()
    },
  },
})
</script>

<style scoped>
.filter {
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
    bottom: 10px;
  }
  & /deep/ .chevron-icon {
    stroke: #fff;
  }
}
</style>
