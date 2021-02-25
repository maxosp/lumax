<template>
  <div class="labels-dropdown">
    <BaseDropdown
      class="input dropdown"
      value="Выберите метки"
      label="Метки"
      placeholder=""
      read-only-dropdown
      @clear="clear"
    >
      <template #default="{closeMenu}">
        <div v-if="$labels.length">
          <SelectItem
            v-for="item in $labels"
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
  $labels,
  $selectedLabels,
  setSelectedLabels,
} from '@/pages/task-creation/test/parts/labels-dropdown/labels-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    Icon,
    BaseDropdown,
    SelectItem,
  },
  effector: {
    $labels,
    $selectedLabels,
  },
  methods: {
    loadLabels,
    onSelectItem(item: DropdownItem, cb: any) {
      const existedItem = this.$selectedLabels.find((label: DropdownItem) => label.name === item.name)
      if (existedItem) {
        const labels = this.$selectedLabels.filter((label: DropdownItem) => label.name !== item.name)
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
      // clear handle
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