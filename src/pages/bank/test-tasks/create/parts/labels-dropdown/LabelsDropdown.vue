<template>
  <div class="labels-dropdown">
    <FilterDropdown
      label="Метки"
      placeholder="Выберите метки"
      :data="$items"
      :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
      :store="{ $item, $itemsDropdown, $searchString }"
      :loading="$loading"
      :disabled="isDisabled ? !$canSetLabels : false"
      :selectedData="$selectedLabels"
      @infiniteHandler="nextPageTrigger"
      @item-changed="onSelectItem"
    />
    <div class="selected-labels">
      <div
        v-for="item in $selectedLabels"
        :key="item.name"
        class="label"
      >
        <span>{{ item.title }}</span>
        <Icon
          type='close'
          class='close'
          size="8"
          @click="onRemoveItem(item)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  loadLabels,
  $canSetLabels,
  $selectedLabels,
  setSelectedLabels,
  labelsDropdownModule,
} from '@/pages/bank/test-tasks/create/parts/labels-dropdown/labels-dropdown.model'
import { DropdownItem } from '@/pages/common/types'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import { $selectedClass } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import { $selectedSubject } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { $selectedTheme } from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'

export default Vue.extend({
  components: {
    Icon,
    FilterDropdown,
  },
  props: {
    isDisabled: { type: Boolean, default: false },
  },
  effector: {
    $selectedClass,
    $selectedSubject,
    $selectedTheme,
    $selectedLabels,
    $canSetLabels,
    ...labelsDropdownModule.store,
  },
  computed: {
    correctValue(): string {
      const arr = [...this.$itemsDropdown]
      const currentItem = arr.find((el: DropdownItem) => el.name === this.$item)
      return currentItem ? currentItem.title : this.$searchString
    },
  },
  methods: {
    loadLabels,
    ...labelsDropdownModule.methods,
    onSelectItem(item: DropdownItem) {
      const existedItem = this.$selectedLabels.find(
        (label: DropdownItem) => label.name === item.name
      )
      if (existedItem) {
        const labels = this.$selectedLabels.filter(
          (label: DropdownItem) => label.name !== item.name
        )
        setSelectedLabels(labels)
      } else {
        setSelectedLabels([item, ...this.$selectedLabels])
      }
    },
    onRemoveItem(item: DropdownItem) {
      const labels = this.$selectedLabels.filter((label: DropdownItem) => label.name !== item.name)
      setSelectedLabels(labels)
    },
    clear() {
      this.resetItem()
      this.resetSearchString()
    },
  },
  beforeDestroy() {
    this.dropdownDestroy()
  },
  mounted() {
    if (this.$selectedClass && this.$selectedSubject && this.$selectedTheme) loadLabels()
  },
})
</script>

<style scoped>
.selected-labels {
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.label {
  color: #000;
  line-height: 16px;
  padding: 7px 10px;
  background-color: var(--c-grey-8);
  border-radius: 6px;
  margin: 0 10px 10px 0;
}
.close {
  cursor: pointer;
  margin-left: 10px;
  fill: var(--c-grey-3);
}
</style>
