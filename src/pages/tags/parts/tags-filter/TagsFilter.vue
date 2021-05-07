<template>
  <div
    v-click-outside="closeFilter"
    v-if="visible"
    class="filter"
  >
    <Icon
      type="close"
      class="close-icon"
      size="10"
      @click="toggleVisibility(false)"
    />
    <div class="arrow-up" />
    <div class="section">
      <SubjectDropdown @setItem="val => setItem({'subject': val})" />
      <ClassDropdown @setItem="val => setItem({'study_year': val})" />
    </div>
    <div class="btns">
      <div class="btn">
        <BaseButton
          small
          @click="applyFilters"
        >
          Применить
        </BaseButton>
      </div>
      <div class="btn">
        <BaseButton
          class="borderless"
          small
          border-without-bg
          @click="resetFilters"
        >
          Сбросить фильтры
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ClickOutside from '@/features/directives/click-outside.ts'
import Icon from '@/ui/icon/Icon.vue'
import {
  toggleVisibility,
  reset,
  tagsFilters,
} from '@/pages/tags/parts/tags-filter/tags-filter.model'

import BaseButton from '@/ui/button/BaseButton.vue'
import { FiltersParams } from '@/pages/common/types'
import { dropdownComponents } from '@/pages/tags/parts/tags-filter/parts/dropdown-components'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'TagsFilter',
  components: {
    Icon,
    SubjectDropdown: dropdownComponents.SubjectDropdown,
    ClassDropdown: dropdownComponents.ClassDropdown,
    BaseButton,
  },
  effector: {
    $filterParams: tagsFilters.store.$filterParams,
  },
  props: {
    visible: { type: Boolean, required: true, default: false },
  },
  methods: {
    toggleVisibility,
    reset,
    closeFilter({ target }: any) {
      // check for close icon (clear filter dropdown)
      if (target.href && target.href.baseVal === '#close-icon') {
        return
      }
      // check for general filter icon
      if (
        target.id !== 'filter-icon' &&
        target.parentElement &&
        target.parentElement.id !== 'filter-icon'
      ) {
        toggleVisibility(false)
      }
    },
    setItem(filter: FiltersParams) {
      this.$emit('changeFilter', filter)
    },
    applyFilters() {
      this.$emit('setFilter')
      toggleVisibility(false)
    },
    resetFilters() {
      this.$emit('resetFilter') // general filter
      reset() // togglers and visibility
    },
  },
})
</script>

<style scoped>
.filter {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  padding: 43px 20px;
  background-color: #fff;
  z-index: 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
}
.close-icon {
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  fill: var(--c-grey-3);
}
.arrow-up {
  @mixin arrow-up;
}
.section {
  @mixin flex-row-central;
  justify-content: space-between;
  margin-bottom: 20px;
  .input {
    width: calc((100% - 20px) / 2);
  }
}
.btns {
  @mixin flex-row-central;
  justify-content: center;

  .btn:first-child {
    margin-right: 20px;
  }
}
</style>
