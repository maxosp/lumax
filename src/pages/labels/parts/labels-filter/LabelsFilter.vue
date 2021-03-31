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
    </div>
    <div class="section">
      <ClassDropdown @setItem="val => changeFilter('study_year', val)" />
    </div>
    <div class="section">
      <ThemeDropdown is-preload @setItem="val => changeFilter('theme', val)" />
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
import SubjectDropdown from '@/pages/common/dropdowns/subject/SubjectsDropdown.vue'
import ClassDropdown from '@/pages/common/dropdowns/class/ClassesDropdown.vue'
import ThemeDropdown from '@/pages/common/dropdowns/themes-tree/ThemeDropdown.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import { classesDropdownModule } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import { subjectsDropdownModule } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { themesDropdownModule } from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'TagsFilter',
  components: {
    Icon,
    SubjectDropdown,
    ClassDropdown,
    ThemeDropdown,
    BaseButton,
  },
  props: {
    visible: { type: Boolean, required: true, default: false },
    filterParams: { type: Object, required: true },
  },
  data() {
    return {
      dropdownsFilter: { subject: null, study_year: null, created_by: null } as any,
      classModuleMethods: classesDropdownModule.methods,
      subjectModuleMethods: subjectsDropdownModule.methods,
      themeModuleMethods: themesDropdownModule.methods,
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
      this.$emit('setFilter', filter)
      toggleVisibility(false)
    },
    resetFilters() {
      this.dropdownsFilter = {}

      this.classModuleMethods.resetItem()
      this.subjectModuleMethods.resetItem()
      this.themeModuleMethods.resetItem()
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
