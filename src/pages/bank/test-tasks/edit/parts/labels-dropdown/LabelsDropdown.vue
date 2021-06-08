<template>
  <div class="labels-dropdown">
    <FilterDropdown
      label="Метки"
      placeholder="Выберите метки"
      :data="$items"
      :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
      :store="{ $item, $itemsDropdown, $searchString }"
      :loading="$loading"
      :disabled="!$canSetLabels"
      :selected-data="$selectedLabels"
      secondClick
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
  $selectedLabels,
  setSelectedLabels,
  $currentLabelsIDs,
  loadCurrentLabelsIDs,
  loadCurrentLabels,
  $currentLabel,
  resetLabels,
  labelsDropdownModule,
  $canSetLabels,
} from '@/pages/bank/test-tasks/edit/parts/labels-dropdown/labels-dropdown.model'
import { DropdownItem } from '@/pages/common/types'
import { DEFAULT_ID } from '@/pages/common/constants'
import { Navigate } from '@/features/navigation'
import { $currentQuestion } from '@/pages/preview-tasks/parts/select-task/select-task.model'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import { $selectedClass } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import { $selectedSubject } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { $selectedTheme } from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'

export default Vue.extend({
  components: {
    Icon,
    FilterDropdown,
  },
  effector: {
    ...labelsDropdownModule.store,
    $selectedLabels,
    $currentLabelsIDs,
    $currentLabel,
    $currentQuestion,
    $canSetLabels,
  },
  watch: {
    $currentLabelsIDs: {
      immediate: false,
      handler() {
        this.$currentLabelsIDs.map((l) => loadCurrentLabels(l))
      },
    },
    $currentLabel: {
      immediate: false,
      handler() {
        const index = this.$selectedLabels.findIndex(
          (label) => label.name === this.$currentLabel.name
        )
        if (index === DEFAULT_ID) {
          setSelectedLabels([
            ...this.$selectedLabels,
            {
              name: `${this.$currentLabel.name}`,
              title: this.$currentLabel.title,
            },
          ])
        }
      },
    },
    $currentQuestion: {
      immediate: false,
      handler() {
        if (this.$route.name === 'test-tasks-edit') {
          resetLabels()
          const taskIds = (this.$route as Navigate).query!.questions.split(',')
          const taskId = +taskIds[+this.$route.query.currentQuestion - 1]
          loadCurrentLabelsIDs(taskId)
        }
      },
    },
  },
  methods: {
    loadLabels,
    ...labelsDropdownModule.methods,
    onSelectItem(item: DropdownItem) {
      if (this.$selectedLabels && item) {
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
      }
    },
    onRemoveItem(item: DropdownItem) {
      const labels = this.$selectedLabels.filter((label: DropdownItem) => label.name !== item.name)
      setSelectedLabels(labels)
      this.itemChanged(this.$selectedLabels.length ? this.$selectedLabels[0].name : null)
    },
    clear() {
      // clear handle
    },
  },
  beforeMount() {
    loadCurrentLabelsIDs(+this.$route.params.id)
  },
  mounted() {
    if ($selectedClass && $selectedSubject && $selectedTheme) loadLabels()
  },
  beforeDestroy() {
    this.resetDropdown()
    this.dropdownDestroy()
    setSelectedLabels([])
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
