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
    </div>
    <div class="section">
      <ClassDropdown @setItem="val => setItem({'study_year': val})" />
    </div>
    <div class="section">
      <ThemeDropdown is-preload @setItem="val => setItem({'theme': val})" />
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ClickOutside from '@/features/directives/click-outside'
import Icon from '@/ui/icon/Icon.vue'
import { toggleVisibility, reset } from '@/pages/labels/parts/labels-filter/labels-filter.model'
import BaseButton from '@/ui/button/BaseButton.vue'
import { FiltersParams } from '@/pages/common/types'
import { dropdownComponents } from '@/pages/labels/parts/labels-filter/parts/dropdown-components'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'TagsFilter',
  components: {
    Icon,
    SubjectDropdown: dropdownComponents.SubjectDropdown,
    ClassDropdown: dropdownComponents.ClassDropdown,
    ThemeDropdown: dropdownComponents.ThemeDropdown,
    BaseButton,
  },
  props: {
    visible: { type: Boolean, required: true, default: false },
    filterParams: { type: Object, required: true },
  },
  methods: {
    toggleVisibility,
    reset,
    closeFilter(event: any) {
      // check for close icon (clear filter dropdown)
      if (event.target.href && event.target.href.baseVal === '#close-icon') {
        return
      }
      // check for general filter icon
      if (
        event.target.id !== 'filter-icon' &&
        event.target.parentElement &&
        event.target.parentElement.id !== 'filter-icon'
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
  padding: 30px 20px;
  background-color: #fff;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
  flex-direction: column;
  width: calc((100% - 100px) / 3);
  .input {
    width: 100%;
  }
}
.btns {
  width: 100%;
  @mixin flex-row-central;
  justify-content: flex-start;
  margin-top: 20px;
}
</style>
