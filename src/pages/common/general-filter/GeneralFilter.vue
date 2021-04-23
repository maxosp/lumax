<template>
  <div class="filter">
    <FormInput
      :value="$searchString"
      label=''
      placeholder="Поиск"
      class="input"
      clear-btn
      @clear="clear"
      @input="handleSearchString"
    />
    <div class="right-section">
      <BaseDropdown
        class="dropdown"
        :placeholder="$searchField.title"
        :value="$searchField.title"
        label=""
        read-only-dropdown
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
      <div
        v-if="isShowFilter"
        id="filter-icon"
        class="filter-wrapper"
        @click="$emit('handleFilterVisibility')"
      >
        <Icon
          class="filter-settings"
          type="filter-settings"
        />
        <span> Фильтр </span>
      </div>
    </div>
    <slot name="filter" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import FormInput from '@/ui/input/FormInput.vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  $searchString,
  searchStringChanged,
  $searchField,
  searchFieldChanged,
  reset,
} from '@/pages/common/general-filter/general-filter.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  name: 'GeneralFilter',
  components: {
    FormInput,
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
    isShowFilter: { type: Boolean, default: true },
  },
  data: () => ({
    debounceId: undefined as ReturnType<typeof setTimeout> | undefined,
  }),
  methods: {
    searchStringChanged,
    searchFieldChanged,
    handleSearchString(value: string) {
      if (this.debounceId !== undefined) {
        clearTimeout(this.debounceId)
      }
      this.debounceId = setTimeout(() => {
        searchStringChanged(value)
        this.$emit('changeFilter', {
          search: value,
        })
        this.$emit('setFilter')
      }, 600)
    },
    handleSearchFieldClick(item: DropdownItem, cb: any) {
      searchFieldChanged(item)
      this.$emit('changeFilter', {
        search_area: `search_${item.name}`,
      })
      this.$emit('setFilter')
      cb()
    },
    clear() {
      this.handleSearchString('')
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
  padding: 0 5px 0 20px;
  background-color: #fff;
  border-radius: 7px;
  margin-bottom: 20px;
}

.input {
  width: 100%;
  & /deep/ .wrap {
    height: 100%;
  }
  & /deep/ label {
    height: 100%;
  }
  & /deep/ .label {
    display: none;
  }
  & /deep/ .icon-wrap {
    height: 100%;
  }

  & /deep/ .inner-input {
    border: none;
    height: 100%;
    width: 100%;
    background: transparent;
  }
}

.right-section {
  display: flex;
  align-items: center;
  & ::v-deep .inner-input {
    min-width: 164px;
  }
}
.dropdown {
  & /deep/ .label {
    display: none;
  }
  & /deep/ .inner-input {
    background-color: var(--c-grey-3);
    color: #fff;
    font-weight: 600;
    height: 30px;
    padding-right: 0px;
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

.filter-wrapper {
  @mixin flex-row-central;
  margin: 0 20px;
  cursor: pointer;
  span {
    font-weight: 600;
    color: var(--base-text-primary);
  }
}
.filter-settings {
  margin-right: 10px;
}
</style>
