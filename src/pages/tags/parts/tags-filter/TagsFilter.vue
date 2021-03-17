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
      <SubjectDropdown @setItem="val => changeFilter('subject', val)" />
      <ClassDropdown @setItem="val => changeFilter('study_year', val)" />
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
import { toggleVisibility, reset } from '@/pages/tags/parts/tags-filter/tags-filter.model'
import SubjectDropdown from '@/pages/tags/parts/tags-filter/parts/subject/SubjectDropdown.vue'
import ClassDropdown from '@/pages/tags/parts/tags-filter/parts/class/ClassDropdown.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import { classDropdownModule } from '@/pages/tags/parts/tags-filter/parts/class/class-dropdown.model'
import { subjectDropdownModule } from '@/pages/tags/parts/tags-filter/parts/subject/subject-dropdown.model'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'TagsFilter',
  components: {
    Icon,
    SubjectDropdown,
    ClassDropdown,
    BaseButton,
  },
  props: {
    visible: { type: Boolean, required: true, default: false },
    filterParams: { type: Object, required: true },
  },
  data() {
    return {
      dropdownsFilter: { subject: null, study_year: null, created_by: null } as any,
      classModuleMethods: classDropdownModule.methods,
      subjectModuleMethods: subjectDropdownModule.methods,
    }
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
    changeFilter(name: string, value: string | null) {
      this.dropdownsFilter = { ...this.dropdownsFilter, [name]: value }
    },
    applyFilters() {
      const filter = {}
      // set dropdowns value to filter
      Object.keys(this.dropdownsFilter).forEach((dropdownFilterKey) => {
        if (this.dropdownsFilter[dropdownFilterKey]) {
          filter[dropdownFilterKey] = this.dropdownsFilter[dropdownFilterKey]
        }
      })
      // call table filter
      this.$emit('setFilter', {
        ...this.$props.filterParams,
        ...filter,
      })
      toggleVisibility(false)
    },
    resetFilters() {
      this.dropdownsFilter = {}

      this.classModuleMethods.resetItem()
      this.subjectModuleMethods.resetItem()
      this.$emit('resetFilter') // general filter
      reset() // visibility
    },
  },
  mounted() {
    const container = document.querySelector('#tags-page')
    container && container.addEventListener('reset-themes-filter', this.resetFilters, false)
  },
  beforeDestroy() {
    const container = document.querySelector('#tags-page')
    container && container.removeEventListener('reset-themes-filter', this.resetFilters, false)
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
}
</style>
