<template>
  <div class="labels-dropdown">
    <BaseDropdown
      class="input dropdown"
      :value="correctValue"
      :disabled="isDisabled ? !$canSetLabels : false"
      label="Метки"
      placeholder="Выберите метки"
      @input="searchStringChanged"
      @clear="clear"
    >
      <template #default="{closeMenu}">
        <div v-if="$itemsDropdown.length">
          <SelectItem
            v-for="item in $itemsDropdown"
            :key="item.name"
            :placeholder="item.title"
            @click="onSelectItem(item, closeMenu)"
          >
            {{ item.title }}
          </SelectItem>
        </div>
        <div v-else>
          <SelectItem @click="closeMenu">Нет созданных меток</SelectItem>
        </div>
      </template>
    </BaseDropdown>
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
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import {
  loadLabels,
  $canSetLabels,
  $selectedLabels,
  setSelectedLabels,
  labelsDropdownModule,
} from '@/pages/bank/test-tasks/create/parts/labels-dropdown/labels-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    Icon,
    BaseDropdown,
    SelectItem,
  },
  props: {
    isDisabled: { type: Boolean, default: false },
  },
  effector: {
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
    onSelectItem(item: DropdownItem, cb: any) {
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
      cb()
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
  mounted() {
    loadLabels()
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